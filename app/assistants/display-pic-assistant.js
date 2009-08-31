DisplayPicAssistant = Class.create({
	
	imageURL: false,
	title: false,
	
	img: false,
	scroller: false,
	orientation: false,
	activated: false,
	
	initialize: function(o)
	{
		
		var o = o || {};
		this.imageURL = o.imageURL || false;
		this.title = o.title || false;
		this._provideURL = this.provideURL.bindAsEventListener(this);
	},
	
	setup: function()
	{
		if (!this.imageURL)
		{
			this.controller.stageController.popScene();
		}
		
		this.flipviewElement = this.controller.get('image_flipview_full');
		var wW = this.controller.getSceneScroller().offsetWidth;
		var wH = this.controller.getSceneScroller().offsetHeight;
		this.flipviewElement.setStyle({height: wH + "px" , width: wW + "px"});
		this.controller.setupWidget('image_flipview_full' , {} , {});
		
		this.appMenuModel = { visible: true, items: [{ label: $L('Save Photo'), command: 'savePhoto' }]};
		this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
		
	},
	
	handleCommand: function(event)
	{
		
		if(event.type == Mojo.Event.command) 
		{
			switch(event.command)
			{
				case 'savePhoto':
					var onSuccess = this.onSuccessPhotoSave.bind(this);
					var onFailure = this.onFailurePhotoSave.bind(this);
					/*var save = new Mojo.Service.Request('palm://com.deliciousmorsel.twee' , {
									method: 'saveAttachment',
									onSuccess: onSuccess,
									onFailure: onFailure,
									parameters : { uri : imgUrl }	  
				    });*/
				    
				   var imgurl = this.imageURL.replace(' ' , '%20');
				   this._downloadRequest = new Mojo.Service.Request('palm://com.palm.downloadmanager', {
				   		method: 'download',
						parameters: {
							id: 'com.deliciousmorsel.twee',
							'target': imgurl, 
							'targetDir': '/media/internal/wallpapers'
							},
						'onSuccess': onSuccess,
						'onFailure': onFailure
					});
				    
				break;
			}
		}
	},
	
	onSuccessPhotoSave: function()
	{
		 var banner = this.controller.showBanner({messageText: "Photo saved successfully." , icon: "twee"} , {} , "twee");
	},
	
	onFailurePhotoSave: function()
	{
		var banner = this.controller.showBanner({messageText: "Unable to save photo. " , icon: "twee"} , {} , "twee");
	},
	
	activate: function(event)
	{
		var img = new Image();
		img.onload = this._provideURL;
		img.src = this.imageURL;
	},
	
	deactivate: function(event)
	{
		
	},
	
	provideURL: function()
	{
			this.flipviewElement.removeClassName('loading');
			this.flipviewElement.mojo.centerUrlProvided(this.imageURL);
	}

});
