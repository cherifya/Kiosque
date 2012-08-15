Carrousel=SC.Application.create({NAMESPACE:"Carrousel",VERSION:"0.1.0"});Carrousel.thumbsController=SC.ArrayController.create({init:function(){}});
Carrousel.Theme=SC.AceTheme.create({name:"carrousel"});SC.Theme.addTheme(Carrousel.Theme);
SC.defaultTheme="carrousel";Carrousel.mainPage=SC.Page.design({mainPane:SC.MainPane.design({childViews:"carrousel".w(),labelView:SC.LabelView.design({layout:{centerX:0,centerY:0,width:200,height:18},textAlign:SC.ALIGN_CENTER,tagName:"h1",value:"Welcome to SproutCore!"}),carrousel:Iweb.CarrouselView.design({layout:{centerY:0,centerX:0,width:300,height:60},contentValueKey:"order",contentBinding:"Carrousel.thumbsController.arrangedObjects",selectionBinding:"Carrousel.thumbsController.selection",columnWidth:60,rowHeight:60,exampleView:SC.LabelView.design({classNames:"fantasy-label".w()})}),scrollView:SC.ScrollView.design({backgroundColor:"white",layout:{centerY:0,centerX:0,width:300,height:60},canScrollVertical:NO,hasVerticalScroller:NO,alwaysBounceHorizontal:YES,alwaysBounceVertical:NO,_applyCSSTransforms:function(layer){var transform="";
this.updateScale(this._scale);transform+="translate3d("+-this._scroll_horizontalScrollOffset+"px, "+-Math.round(this._scroll_verticalScrollOffset)+"px,0) ";
transform+=this._scale_css;if(layer){SC.Logger.debug("webkitTransform %@... %@".fmt(transform,this));
layer.style.webkitTransformOrigin="top left"}},contentView:SC.GridView.design({backgroundColor:"gray",layout:{top:0,left:0,width:300,height:60},contentValueKey:"order",contentBinding:"Carrousel.thumbsController.arrangedObjects",selectionBinding:"Carrousel.thumbsController.selection",columnWidth:60,rowHeight:60,layoutForContentIndex:function(contentIndex){var rowHeight=this.get("rowHeight")||48,columnWidth=this.get("columnWidth")||48;
return{left:contentIndex*columnWidth,top:0,height:rowHeight,width:columnWidth}},computeLayout:function(){var content=this.get("content"),count=(content)?content.get("length"):0,rowHeight=this.get("rowHeight")||48,columnWidth=this.get("columnWidth")||48,itemsPerRow=(count)?count:0,rows=Math.ceil(count/itemsPerRow);
var ret=this._cachedLayoutHash;if(!ret){ret=this._cachedLayoutHash={}}ret.minHeight=rows*rowHeight;
this.calculatedHeight=ret.minHeight;ret.minWidth=count*columnWidth;this.calculatedWidth=ret.minWidth;
return ret}})})})});Carrousel.main=function main(){Carrousel.getPath("mainPage.mainPane").append();
var thumbs=[];for(var i=10;i>=0;i--){var thumb=SC.Object.create({order:i});thumbs.push(thumb)
}Carrousel.thumbsController.set("content",thumbs)};function main(){Carrousel.main()
};