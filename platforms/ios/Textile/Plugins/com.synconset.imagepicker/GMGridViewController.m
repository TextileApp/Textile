//
//  GMGridViewController.m
//  GMPhotoPicker
//
//  Created by Guillermo Muntaner Perelló on 19/09/14.
//  Copyright (c) 2014 Guillermo Muntaner Perelló. All rights reserved.
//

#import "GMGridViewController.h"
#import "GMImagePickerController.h"
#import "GMAlbumsViewController.h"
#import "GMGridViewCell.h"
#import "GMPHAsset.h"

//#import "PSYBlockTimer.h"
#import "GMFetchItem.h"



#define CDV_PHOTO_PREFIX @"cdv_photo_"
#define CDV_THUMB_PREFIX @"cdv_thumb_"


//Helper methods
@implementation NSIndexSet (Convenience)
- (NSArray *)aapl_indexPathsFromIndexesWithSection:(NSUInteger)section {
    NSMutableArray *indexPaths = [NSMutableArray arrayWithCapacity:self.count];
    [self enumerateIndexesUsingBlock:^(NSUInteger idx, BOOL *stop) {
        [indexPaths addObject:[NSIndexPath indexPathForItem:idx inSection:section]];
    }];
    return indexPaths;
}
@end
@implementation UICollectionView (Convenience)
- (NSArray *)aapl_indexPathsForElementsInRect:(CGRect)rect {
    NSArray *allLayoutAttributes = [self.collectionViewLayout layoutAttributesForElementsInRect:rect];
    if (allLayoutAttributes.count == 0) { return nil; }
    NSMutableArray *indexPaths = [NSMutableArray arrayWithCapacity:allLayoutAttributes.count];
    for (UICollectionViewLayoutAttributes *layoutAttributes in allLayoutAttributes) {
        NSIndexPath *indexPath = layoutAttributes.indexPath;
        [indexPaths addObject:indexPath];
    }
    return indexPaths;
}
@end



@interface GMImagePickerController (){
}

- (void)finishPickingAssets:(id)sender;
- (NSString *)toolbarTitle;
- (UIView *)noAssetsView;

@end


@interface GMGridViewController () <PHPhotoLibraryChangeObserver>

@property (nonatomic, weak) GMImagePickerController *picker;
@property (strong) PHCachingImageManager *imageManager;
@property CGRect previousPreheatRect;

@end

static CGSize AssetGridThumbnailSize;
NSString * const GMGridViewCellIdentifier = @"GMGridViewCellIdentifier";

@implementation GMGridViewController
{
    CGFloat screenWidth;
    CGFloat screenHeight;
    UICollectionViewFlowLayout *portraitLayout;
    UICollectionViewFlowLayout *landscapeLayout;
    
    NSFileManager* fileMgr;
    NSString* docsPath;
    int docCount;
    int doc_thumbCount;
}

@synthesize dic_asset_fetches;

-(id)initWithPicker:(GMImagePickerController *)picker
{
    //Custom init. The picker contains custom information to create the FlowLayout
    self.picker = picker;
    
    //Ipad popover is not affected by rotation!
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
    {
        screenWidth = CGRectGetWidth(picker.view.bounds);
        screenHeight = CGRectGetHeight(picker.view.bounds);
    }
    else
    {
        if(UIInterfaceOrientationIsLandscape([UIApplication sharedApplication].statusBarOrientation))
        {
            screenHeight = CGRectGetWidth(picker.view.bounds);
            screenWidth = CGRectGetHeight(picker.view.bounds);
        }
        else
        {
            screenWidth = CGRectGetWidth(picker.view.bounds);
            screenHeight = CGRectGetHeight(picker.view.bounds);
        }
    }
    
    
    UICollectionViewFlowLayout *layout = [self collectionViewFlowLayoutForOrientation:[UIApplication sharedApplication].statusBarOrientation];
    if (self = [super initWithCollectionViewLayout:layout])
    {
        //Compute the thumbnail pixel size:
        CGFloat scale = [UIScreen mainScreen].scale;
        //NSLog(@"This is @%fx scale device", scale);
        AssetGridThumbnailSize = CGSizeMake(layout.itemSize.width * scale, layout.itemSize.height * scale);
        
        self.collectionView.allowsMultipleSelection = YES;
        
        [self.collectionView registerClass:GMGridViewCell.class
                forCellWithReuseIdentifier:GMGridViewCellIdentifier];
        
        self.preferredContentSize = kPopoverContentSize;
    }
    
    ///
    fileMgr = [[NSFileManager alloc] init];
    //dic_asset_fetches = [[NSMutableDictionary alloc] init];
    docsPath = [NSTemporaryDirectory()stringByStandardizingPath];
    docCount = 0;
    doc_thumbCount = 0;
    
    return self;
}


- (void)viewDidLoad
{
    [super viewDidLoad];
    [self setupViews];
    
    //Navigation bar customization_
    if(self.picker.customNavigationBarPrompt)
    {
        self.navigationItem.prompt = self.picker.customNavigationBarPrompt;
    }
    
    self.imageManager = [[PHCachingImageManager alloc] init];
    [self resetCachedAssets];
    [[PHPhotoLibrary sharedPhotoLibrary] registerChangeObserver:self];
    
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    [self setupButtons];
    [self setupToolbar];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self updateCachedAssets];
}

- (void)dealloc
{
    [self resetCachedAssets];
    [[PHPhotoLibrary sharedPhotoLibrary] unregisterChangeObserver:self];
}



#pragma mark - Rotation

- (void)willAnimateRotationToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
    {
        return;
    }
    
    UICollectionViewFlowLayout *layout = [self collectionViewFlowLayoutForOrientation:toInterfaceOrientation];
    
    //Update the AssetGridThumbnailSize:
    CGFloat scale = [UIScreen mainScreen].scale;
    AssetGridThumbnailSize = CGSizeMake(layout.itemSize.width * scale, layout.itemSize.height * scale);
    
    [self resetCachedAssets];
    //This is optional. Reload visible thumbnails:
    for (GMGridViewCell *cell in [self.collectionView visibleCells])
    {
        NSInteger currentTag = cell.tag;
        [self.imageManager requestImageForAsset:cell.asset
                                     targetSize:AssetGridThumbnailSize
                                    contentMode:PHImageContentModeAspectFill
                                        options:nil
                                  resultHandler:^(UIImage *result, NSDictionary *info)
                                    {
                                        // Only update the thumbnail if the cell tag hasn't changed. Otherwise, the cell has been re-used.
                                        if (cell.tag == currentTag) {
                                            [cell.imageView setImage:result];
                                        }
                                    }];
    }
    
    [self.collectionView setCollectionViewLayout:layout animated:YES];
}






#pragma mark - Setup

- (void)setupViews
{
    self.collectionView.backgroundColor = [UIColor whiteColor];
}

- (void)setupButtons
{
    self.navigationItem.rightBarButtonItem =
    [[UIBarButtonItem alloc] initWithTitle:NSLocalizedStringFromTable(@"picker.navigation.done-button", @"GMImagePicker",@"Done")
                                     style:UIBarButtonItemStyleDone
                                    target:self.picker
                                    action:@selector(finishPickingAssets:)];
    
    self.navigationItem.rightBarButtonItem.enabled = (self.picker.selectedAssets.count > 0);
}

- (void)setupToolbar
{
    self.toolbarItems = self.picker.toolbarItems;
}

#pragma mark - Collection View Layout


- (UICollectionViewFlowLayout *)collectionViewFlowLayoutForOrientation:(UIInterfaceOrientation)orientation
{
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
    {
        if(!portraitLayout)
        {
            portraitLayout = [[UICollectionViewFlowLayout alloc] init];
            portraitLayout.minimumInteritemSpacing = self.picker.minimumInteritemSpacing;
            int cellTotalUsableWidth = screenWidth - (self.picker.colsInPortrait-1)*self.picker.minimumInteritemSpacing;
            portraitLayout.itemSize = CGSizeMake(cellTotalUsableWidth/self.picker.colsInPortrait, cellTotalUsableWidth/self.picker.colsInPortrait);
            double cellTotalUsedWidth = (double)portraitLayout.itemSize.width*self.picker.colsInPortrait;
            double spaceTotalWidth = (double)screenWidth-cellTotalUsedWidth;
            double spaceWidth = spaceTotalWidth/(double)(self.picker.colsInPortrait-1);
            portraitLayout.minimumLineSpacing = spaceWidth;
        }
        return portraitLayout;
    }
    else
    {
        if(UIInterfaceOrientationIsLandscape(orientation))
        {
            if(!landscapeLayout)
            {
                landscapeLayout = [[UICollectionViewFlowLayout alloc] init];
                landscapeLayout.minimumInteritemSpacing = self.picker.minimumInteritemSpacing;
                int cellTotalUsableWidth = screenHeight - (self.picker.colsInLandscape-1)*self.picker.minimumInteritemSpacing;
                landscapeLayout.itemSize = CGSizeMake(cellTotalUsableWidth/self.picker.colsInLandscape, cellTotalUsableWidth/self.picker.colsInLandscape);
                double cellTotalUsedWidth = (double)landscapeLayout.itemSize.width*self.picker.colsInLandscape;
                double spaceTotalWidth = (double)screenHeight-cellTotalUsedWidth;
                double spaceWidth = spaceTotalWidth/(double)(self.picker.colsInLandscape-1);
                landscapeLayout.minimumLineSpacing = spaceWidth;
            }
            return landscapeLayout;
        }
        else
        {
            if(!portraitLayout)
            {
                portraitLayout = [[UICollectionViewFlowLayout alloc] init];
                portraitLayout.minimumInteritemSpacing = self.picker.minimumInteritemSpacing;
                int cellTotalUsableWidth = screenWidth - (self.picker.colsInPortrait-1)*self.picker.minimumInteritemSpacing;
                portraitLayout.itemSize = CGSizeMake(cellTotalUsableWidth/self.picker.colsInPortrait, cellTotalUsableWidth/self.picker.colsInPortrait);
                double cellTotalUsedWidth = (double)portraitLayout.itemSize.width*self.picker.colsInPortrait;
                double spaceTotalWidth = (double)screenWidth-cellTotalUsedWidth;
                double spaceWidth = spaceTotalWidth/(double)(self.picker.colsInPortrait-1);
                portraitLayout.minimumLineSpacing = spaceWidth;
            }
            return portraitLayout;
        }
    }
}


#pragma mark - Collection View Data Source

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView
{
    return 1;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    GMGridViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:GMGridViewCellIdentifier
                                                             forIndexPath:indexPath];
    
    // Increment the cell's tag
    NSInteger currentTag = cell.tag + 1;
    cell.tag = currentTag;
    
    PHAsset *asset = self.assetsFetchResults[indexPath.item];
    [cell bind:asset];
    
    //GMFetchItem * fetch_item = [dic_asset_fetches objectForKey:[NSNumber numberWithLong:indexPath.item] ];
    GMFetchItem * fetch_item = [dic_asset_fetches objectForKey:asset ];
    if ( fetch_item == nil ) {
        fetch_item = [[GMFetchItem alloc] init];
        //[ dic_asset_fetches setObject:fetch_item forKey:[NSNumber numberWithLong:indexPath.item] ];
        [ dic_asset_fetches setObject:fetch_item forKey:asset ];
    }
    
    //Optional protocol to determine if some kind of assets can't be selected (pej long videos, etc...)
    if ([self.picker.delegate respondsToSelector:@selector(assetsPickerController:shouldEnableAsset:)])
    {
        cell.enabled = [self.picker.delegate assetsPickerController:self.picker shouldEnableAsset:asset];
    }
    else
    {
        cell.enabled = YES;
    }
    
    // Setting `selected` property blocks further deselection. Have to call selectItemAtIndexPath too. ( ref: http://stackoverflow.com/a/17812116/1648333 )
    if ([self.picker.selectedAssets containsObject:asset])
    {
        cell.selected = YES;
        [collectionView selectItemAtIndexPath:indexPath animated:NO scrollPosition:UICollectionViewScrollPositionNone];
    }
    else
    {
        cell.selected = NO;
    }
    
    [cell set_progress:fetch_item.percent animated:false];
    
    if ( fetch_item.be_finished ) {
        [ cell hide_progress ];
    }
    else if ( fetch_item.be_progressed ) {
        [ cell show_progress ];
        [ cell set_progress:fetch_item.percent animated:false];
    }else{
        [ cell hide_progress ];
    }
    
    if ( fetch_item.be_saving_img ) {
        [ cell show_fetching ];
    }else{
        [ cell hide_fetching ];
    }
    
    //NSLog( @" cell : %ld ", (long)indexPath.item );
    
    /*if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
    {
        NSLog(@"Image manager: Requesting FIT image for iPad");
        [self.imageManager requestImageForAsset:asset
                                     targetSize:AssetGridThumbnailSize
                                    contentMode:PHImageContentModeAspectFit
                                        options:nil
                                  resultHandler:^(UIImage *result, NSDictionary *info) {
                                      
                                      // Only update the thumbnail if the cell tag hasn't changed. Otherwise, the cell has been re-used.
                                      if (cell.tag == currentTag) {
                                          [cell.imageView setImage:result];
                                      }
                                  }];
    }
    else*/
    {
        //NSLog(@"Image manager: Requesting FILL image for iPhone");
        [self.imageManager requestImageForAsset:asset
                                     targetSize:AssetGridThumbnailSize
                                    contentMode:PHImageContentModeAspectFill
                                        options:nil
                                  resultHandler:^(UIImage *result, NSDictionary *info) {
                                      
                                      // Only update the thumbnail if the cell tag hasn't changed. Otherwise, the cell has been re-used.
                                      if (cell.tag == currentTag) {
                                          [cell.imageView setImage:result];
                                      }
                                      
                                      if ( fetch_item.be_saving_img_thumb==false && fetch_item.image_thumb == nil && result!= nil ) {
                                          
                                          fetch_item.be_saving_img_thumb = true;
                                          
                                          NSString * filePath;
                                          do {
                                              filePath = [NSString stringWithFormat:@"%@/%@%03d.%@", docsPath, CDV_THUMB_PREFIX, doc_thumbCount++, @"jpg"];
                                          } while ([fileMgr fileExistsAtPath:filePath]);
                                          
                                          dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                                              
                                              fetch_item.be_saving_img_thumb = false;
                                            
                                              // TODO pass in quality
                                              if ( ![ UIImageJPEGRepresentation(result, 1.0f ) writeToFile:filePath atomically:YES ] ) {
                                                  return;
                                              }
                                              
                                              fetch_item.image_thumb = filePath;
                                              
                                          });
                                      }
                                      
                                      /*GMGridViewCell *cell = (GMGridViewCell *)[collectionView cellForItemAtIndexPath:indexPath];
                                      
                                      if ( cell ) {
                                          [cell.imageView setImage:result];
                                      }
                                      NSLog( @"%d", indexPath.item );*/
                                      
                                  }];
    }
    
    
    
    return cell;
}


#pragma mark - Collection View Delegate

- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    PHAsset *asset = self.assetsFetchResults[indexPath.item];
    //GMFetchItem * fetch_item = [dic_asset_fetches objectForKey:[ NSNumber numberWithLong:indexPath.item ]];
    GMFetchItem * fetch_item = [dic_asset_fetches objectForKey:asset];
    
    GMGridViewCell *cell = (GMGridViewCell *)[collectionView cellForItemAtIndexPath:indexPath];
    
    if ( cell == nil || fetch_item==nil || fetch_item.be_progressed ) {
        return NO;
    }
 
    if ( fetch_item.be_saving_img == false && fetch_item.image_fullsize == nil  ) {
        
        fetch_item.be_progressed = true;
        [ cell show_progress ];
        
        PHImageRequestOptions *ph_options = [[PHImageRequestOptions alloc] init];
        
        [ ph_options setNetworkAccessAllowed:YES];
        
        // @BVL Set Deliverymode, in order to return highest quality
		[ ph_options setDeliveryMode: PHImageRequestOptionsDeliveryModeHighQualityFormat ]; // Best Quality

        [ ph_options setProgressHandler:^(double progress, NSError *error, BOOL *stop, NSDictionary *info) {
            
            fetch_item.percent = progress;
            
            GMGridViewCell *cell = (GMGridViewCell *)[collectionView cellForItemAtIndexPath:indexPath];
            
            if ( cell ) {
                [ cell set_progress:progress animated:false];
            }
            
        }];
        
        
            
        [ self.imageManager requestImageForAsset:asset targetSize:PHImageManagerMaximumSize contentMode:PHImageContentModeDefault options:ph_options resultHandler:^(UIImage *result, NSDictionary *info) {
            
            //dispatch_async(dispatch_get_main_queue(), ^{
            
            GMGridViewCell *cell = (GMGridViewCell *)[collectionView cellForItemAtIndexPath:indexPath];
            
            if ( cell ) {
                [cell hide_progress];
                [cell show_fetching];
            }
            
            fetch_item.be_progressed = false;
            fetch_item.be_finished = true;
            
            //asset.image_fullsize = result;
            
            NSString * filePath;
            do {
                filePath = [NSString stringWithFormat:@"%@/%@%03d.%@", docsPath, CDV_PHOTO_PREFIX, docCount++, @"jpg"];
            } while ([fileMgr fileExistsAtPath:filePath]);
            
            fetch_item.be_saving_img = true;
            
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                
                
                // @BVL: Added orientation-fix to correctly display the returned result
                
//              if ( ![ UIImageJPEGRepresentation(result, 1.0f ) writeToFile:filePath atomically:YES ] ) {
//                  return;
//              }
                
                NSLog(@"original orientation: %ld",(UIImageOrientation)result.imageOrientation);
                
                UIImage *imageToDisplay = result.fixOrientation; //  UIImage+fixOrientation extension
                
          		NSLog(@"corrected orientation: %ld",(UIImageOrientation)imageToDisplay.imageOrientation);

                if ( ![ UIImageJPEGRepresentation(imageToDisplay, 1.0f ) writeToFile:filePath atomically:YES ] ) {
                    return;
                }
                
                fetch_item.image_fullsize = filePath;
                fetch_item.be_saving_img = false;
                
                dispatch_async(dispatch_get_main_queue(), ^{
                    
                    GMGridViewCell *cell = (GMGridViewCell *)[collectionView cellForItemAtIndexPath:indexPath];
                    
                    if ( cell ) {
                        [cell hide_fetching];
                    }

                    //Your main thread code goes in here
                    [ collectionView selectItemAtIndexPath:indexPath animated:NO scrollPosition:UICollectionViewScrollPositionNone ];
                    [ self collectionView:collectionView didSelectItemAtIndexPath:indexPath ];
                });
                
            });
            //});
            
        }];
        
        
        return NO;
    }
    
    if (!cell.isEnabled)
        return NO;
    else if ([self.picker.delegate respondsToSelector:@selector(assetsPickerController:shouldSelectAsset:)])
        return [self.picker.delegate assetsPickerController:self.picker shouldSelectAsset:asset];
    else
        return YES;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    PHAsset *asset = self.assetsFetchResults[indexPath.item];
    //GMFetchItem * fetch_item = [dic_asset_fetches objectForKey:[ NSNumber numberWithLong:indexPath.item ]];
    GMFetchItem * fetch_item = [dic_asset_fetches objectForKey:asset];
    
    [self.picker selectAsset:asset];
    [self.picker selectFetchItem:fetch_item];
    
    if ([self.picker.delegate respondsToSelector:@selector(assetsPickerController:didSelectAsset:)])
        [self.picker.delegate assetsPickerController:self.picker didSelectAsset:asset];
}

- (BOOL)collectionView:(UICollectionView *)collectionView shouldDeselectItemAtIndexPath:(NSIndexPath *)indexPath
{
    PHAsset *asset = self.assetsFetchResults[indexPath.item];
    
    if ([self.picker.delegate respondsToSelector:@selector(assetsPickerController:shouldDeselectAsset:)])
        return [self.picker.delegate assetsPickerController:self.picker shouldDeselectAsset:asset];
    else
        return YES;
}

- (void)collectionView:(UICollectionView *)collectionView didDeselectItemAtIndexPath:(NSIndexPath *)indexPath
{
    PHAsset *asset = self.assetsFetchResults[indexPath.item];
    //GMFetchItem * fetch_item = [dic_asset_fetches objectForKey:[ NSNumber numberWithLong:indexPath.item ]];
    GMFetchItem * fetch_item = [dic_asset_fetches objectForKey:asset];
    
    [self.picker deselectAsset:asset];
    [self.picker deselectFetchItem:fetch_item];
    
    if ([self.picker.delegate respondsToSelector:@selector(assetsPickerController:didDeselectAsset:)])
        [self.picker.delegate assetsPickerController:self.picker didDeselectAsset:asset];
}

- (BOOL)collectionView:(UICollectionView *)collectionView shouldHighlightItemAtIndexPath:(NSIndexPath *)indexPath
{
    PHAsset *asset = self.assetsFetchResults[indexPath.item];
    
    if ([self.picker.delegate respondsToSelector:@selector(assetsPickerController:shouldHighlightAsset:)])
        return [self.picker.delegate assetsPickerController:self.picker shouldHighlightAsset:asset];
    else
        return YES;
}

- (void)collectionView:(UICollectionView *)collectionView didHighlightItemAtIndexPath:(NSIndexPath *)indexPath
{
    PHAsset *asset = self.assetsFetchResults[indexPath.item];
    
    if ([self.picker.delegate respondsToSelector:@selector(assetsPickerController:didHighlightAsset:)])
        [self.picker.delegate assetsPickerController:self.picker didHighlightAsset:asset];
}

- (void)collectionView:(UICollectionView *)collectionView didUnhighlightItemAtIndexPath:(NSIndexPath *)indexPath
{
    PHAsset *asset = self.assetsFetchResults[indexPath.item];
    
    if ([self.picker.delegate respondsToSelector:@selector(assetsPickerController:didUnhighlightAsset:)])
        [self.picker.delegate assetsPickerController:self.picker didUnhighlightAsset:asset];
}



#pragma mark - UICollectionViewDataSource

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    NSInteger count = self.assetsFetchResults.count;
    return count;
}


#pragma mark - PHPhotoLibraryChangeObserver

- (void)photoLibraryDidChange:(PHChange *)changeInstance
{
    // Call might come on any background queue. Re-dispatch to the main queue to handle it.
    dispatch_async(dispatch_get_main_queue(), ^{
        
        // check if there are changes to the assets (insertions, deletions, updates)
        PHFetchResultChangeDetails *collectionChanges = [changeInstance changeDetailsForFetchResult:self.assetsFetchResults];
        if (collectionChanges) {
            
            // get the new fetch result
            self.assetsFetchResults = [collectionChanges fetchResultAfterChanges];
            
            //NSLog( @"reset all" );
            
            UICollectionView *collectionView = self.collectionView;
            
            if (![collectionChanges hasIncrementalChanges] || [collectionChanges hasMoves]) {
                // we need to reload all if the incremental diffs are not available
                [collectionView reloadData];
                
            } else {
                // if we have incremental diffs, tell the collection view to animate insertions and deletions
                [collectionView performBatchUpdates:^{
                    NSIndexSet *removedIndexes = [collectionChanges removedIndexes];
                    if ([removedIndexes count]) {
                        [collectionView deleteItemsAtIndexPaths:[removedIndexes aapl_indexPathsFromIndexesWithSection:0]];
                    }
                    NSIndexSet *insertedIndexes = [collectionChanges insertedIndexes];
                    if ([insertedIndexes count]) {
                        [collectionView insertItemsAtIndexPaths:[insertedIndexes aapl_indexPathsFromIndexesWithSection:0]];
                    }
                    NSIndexSet *changedIndexes = [collectionChanges changedIndexes];
                    if ([changedIndexes count]) {
                        [collectionView reloadItemsAtIndexPaths:[changedIndexes aapl_indexPathsFromIndexesWithSection:0]];
                    }
                } completion:NULL];
            }
            
            [self resetCachedAssets];
        }
    });
}

#pragma mark - UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    [self updateCachedAssets];
}


#pragma mark - Asset Caching

- (void)resetCachedAssets
{
    [self.imageManager stopCachingImagesForAllAssets];
    self.previousPreheatRect = CGRectZero;
}

- (void)updateCachedAssets
{
    BOOL isViewVisible = [self isViewLoaded] && [[self view] window] != nil;
    if (!isViewVisible) { return; }
    
    // The preheat window is twice the height of the visible rect
    CGRect preheatRect = self.collectionView.bounds;
    preheatRect = CGRectInset(preheatRect, 0.0f, -0.5f * CGRectGetHeight(preheatRect));
    
    // If scrolled by a "reasonable" amount...
    CGFloat delta = ABS(CGRectGetMidY(preheatRect) - CGRectGetMidY(self.previousPreheatRect));
    if (delta > CGRectGetHeight(self.collectionView.bounds) / 3.0f) {
        
        // Compute the assets to start caching and to stop caching.
        NSMutableArray *addedIndexPaths = [NSMutableArray array];
        NSMutableArray *removedIndexPaths = [NSMutableArray array];
        
        [self computeDifferenceBetweenRect:self.previousPreheatRect andRect:preheatRect removedHandler:^(CGRect removedRect) {
            NSArray *indexPaths = [self.collectionView aapl_indexPathsForElementsInRect:removedRect];
            [removedIndexPaths addObjectsFromArray:indexPaths];
        } addedHandler:^(CGRect addedRect) {
            NSArray *indexPaths = [self.collectionView aapl_indexPathsForElementsInRect:addedRect];
            [addedIndexPaths addObjectsFromArray:indexPaths];
        }];
        
        NSArray *assetsToStartCaching = [self assetsAtIndexPaths:addedIndexPaths];
        NSArray *assetsToStopCaching = [self assetsAtIndexPaths:removedIndexPaths];
        
        [self.imageManager startCachingImagesForAssets:assetsToStartCaching
                                            targetSize:AssetGridThumbnailSize
                                           contentMode:PHImageContentModeAspectFill
                                               options:nil];
        [self.imageManager stopCachingImagesForAssets:assetsToStopCaching
                                           targetSize:AssetGridThumbnailSize
                                          contentMode:PHImageContentModeAspectFill
                                              options:nil];
        
        self.previousPreheatRect = preheatRect;
    }
}

- (void)computeDifferenceBetweenRect:(CGRect)oldRect andRect:(CGRect)newRect removedHandler:(void (^)(CGRect removedRect))removedHandler addedHandler:(void (^)(CGRect addedRect))addedHandler
{
    if (CGRectIntersectsRect(newRect, oldRect)) {
        CGFloat oldMaxY = CGRectGetMaxY(oldRect);
        CGFloat oldMinY = CGRectGetMinY(oldRect);
        CGFloat newMaxY = CGRectGetMaxY(newRect);
        CGFloat newMinY = CGRectGetMinY(newRect);
        if (newMaxY > oldMaxY) {
            CGRect rectToAdd = CGRectMake(newRect.origin.x, oldMaxY, newRect.size.width, (newMaxY - oldMaxY));
            addedHandler(rectToAdd);
        }
        if (oldMinY > newMinY) {
            CGRect rectToAdd = CGRectMake(newRect.origin.x, newMinY, newRect.size.width, (oldMinY - newMinY));
            addedHandler(rectToAdd);
        }
        if (newMaxY < oldMaxY) {
            CGRect rectToRemove = CGRectMake(newRect.origin.x, newMaxY, newRect.size.width, (oldMaxY - newMaxY));
            removedHandler(rectToRemove);
        }
        if (oldMinY < newMinY) {
            CGRect rectToRemove = CGRectMake(newRect.origin.x, oldMinY, newRect.size.width, (newMinY - oldMinY));
            removedHandler(rectToRemove);
        }
    } else {
        addedHandler(newRect);
        removedHandler(oldRect);
    }
}

- (NSArray *)assetsAtIndexPaths:(NSArray *)indexPaths
{
    if (indexPaths.count == 0) { return nil; }
    
    NSMutableArray *assets = [NSMutableArray arrayWithCapacity:indexPaths.count];
    for (NSIndexPath *indexPath in indexPaths) {
        PHAsset *asset = self.assetsFetchResults[indexPath.item];
        [assets addObject:asset];
    }
    return assets;
}


@end
