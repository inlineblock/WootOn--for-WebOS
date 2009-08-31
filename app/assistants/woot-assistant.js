WootAssistant = Class.create(BaseTab , {
	model: false,
	
	doInitialize: function()
	{
		this.nduid  = new Mojo.Model.Cookie('nduid');
		this.createListeners();
	},
	
	createListeners: function()
	{
		this._loadPurchaseLink = this.loadPurchaseLink.bindAsEventListener(this);
		this._loadFullImage = this.loadFullImage.bindAsEventListener(this);
		this._cacheWoot = this.cacheWoot.bind(this);
		this._refreshWoot = this.refreshWoot.bindAsEventListener(this);
	},
	
	wootType: function()
	{
		return "woot";
	},
	
	getContainerName: function()
	{
		return this.wootType() + "Container";
	},
	
	doSetup: function()
	{
		this.container = this.controller.get(this.getContainerName());
		this.initUpdateIcon();
		this.loadWoot();
	},
	
	loadWoot: function()
	{
		var cache = WootOn.Cache.get(this.wootType());
		if (cache)
		{
			this.model = cache;
			this.modelChanged();
			this.model.update(this.updateCB.bind(this));
			this.updateButtonLoading();
		}
		else
		{
			this.modelChanged();
			this.model = new WootOn.Model();
			this.model.loadViaURL(this.getFeedURL() , this.getFeedCB.bind(this));
			this.updateButtonLoading();
		}
	},
	
	initUpdateIcon: function()
	{
		this.updateIcon = new Element('div' , {className:'updateIcon' , id:'updateIcon'});
		this.controller.getSceneScroller().appendChild(this.updateIcon);
	},
	
	refreshWoot: function()
	{
		if (this.autoRefresh)
		{
			window.clearTimeout(this.autoRefresh);
			this.autoRefresh = false;
		}
		
		if (this.model)
		{
			this.updateButtonLoading();
			this.model.update(this.updateCB.bind(this));
		}
	},
	
	doActivate: function()
	{
		if (this.updateIcon)
    	{
    		this.updateIcon.observe(Mojo.Event.tap , this._refreshWoot);
    	}
	},
	
	doDeactivate: function()
	{
		if (this.updateIcon)
    	{
    		this.updateIcon.stopObserving(Mojo.Event.tap , this._refreshWoot);
    	}
		this.removePurchase();
		this.removeImages();
	},
	
	doCleanup: function()
	{
		window.clearTimeout(this.autoRefresh);
	},
	
	getFeedURL: function()
	{
		var url = "http://www.deliciousmorsel.com/cache/%action%?uuid=%unique%&version=%version%&device=pre"
		var url = url.replace("%action%" , this.wootType());
		var url = url.replace("%version%" , Mojo.Controller.appInfo.version);
		var url = url.replace("%unique%" , this.nduid.get() || "none");
		console.log(url);
		return url;
	},
	
	getFeedCB: function(o)
	{
		if (o)
		{
			this.modelChanged();
		}
		else
		{
			this.errorDialog('Unable to load the feed.');
			this.modelChanged(true);
		}
	},
	
	updateCB: function(o)
	{
		console.log(o);
		if (o)
		{
			this.modelChanged();
		}
		else
		{
			this.errorDialog('Unable to update the feed.');
			this.modelChanged(true);
		}
	},
	
	modelChanged: function(error)
	{
		try
		{
			this.updateButtonNormal();
			this.removePurchase();
			this.removeImages();
			var error = error || false;
			if (error)
			{
				if (!this.model || !this.model.isLoaded)
				{
					this.container.innerHTML = Mojo.View.render({object: {} , template: "woot/error"});
				}
			}
			else if (!this.model)
			{
				this.container.innerHTML = Mojo.View.render({object: {} , template: "woot/loading"});
			}
			else if (this.wootType() == "woot" && this.model.isWootOff())
			{
				
				this.container.innerHTML = Mojo.View.render({object: this.model , template: "woot/wootOffTemplate"});
				window.setTimeout(this._cacheWoot , 250);
				if (this.autoRefresh)
				{
					window.clearTimeout(this.autoRefresh);
					this.autoRefresh = false;
				}
				this.autoRefresh = window.setTimeout(this._refreshWoot , 30000);
			}
			else
			{
				this.container.innerHTML = Mojo.View.render({object: this.model , template: "woot/template"});
				window.setTimeout(this._cacheWoot , 250);
			}
			if (!this.model) return;
			
			this.attachImages();
			this.attachPurchase();
			
		}
		catch(e)
		{
			//
		}
	},
	
	attachImages: function()
	{
		if (!this.container || !this.model) return false;
		var p = this.container.down('div#thumbHolder');
		if (p)
		{
			var img = new Element('img' , {className: 'thumbnail loading' , id: 'productThumbnail' });
			img.width = 128; img.height = 96; img.style.width = '128px'; img.style.height = "96px";
			img.onload = function(e) { var el = e.srcElement || e.target; el.removeClassName('loading'); el.style.display="block"; el.width = 128; el.height = 96; };
			p.insert(img);
			img.src = this.model.thumbnailimage;
			
			p.observe(Mojo.Event.tap , this._loadFullImage);
		}
	},
	
	removeImages: function()
	{
		if (!this.container) return false;
		var p = this.container.down('div#thumbHolder');
		if (p)
		{
			p.stopObserving(Mojo.Event.tap , this._loadFullImage);
		}
	},
	
	attachPurchase: function()
	{
		if (!this.model || !this.model.isSoldout) return;
		
		var place = this.container.down('div#buySoldout');
		if (this.model.isSoldout())
		{
			var img = new Element("img" , {className:"soldout" , id:'soldoutLink' , src:'images/soldout.png'});
			img.style.display ="block";
			place.insert(img);
		}
		else
		{
			var img = new Element("img" , {className:"purchase" , id:'purchaseLink' , src:'images/iwantone.png'});
			img.style.display ="block";
			place.insert(img);
			place.observe(Mojo.Event.tap , this._loadPurchaseLink);
		}
			
	},
	
	removePurchase: function()
	{
		if (!this.container) return false;
		var p = this.container.down('div#buySoldout');
		if (p)
		{
			p.stopObserving(Mojo.Event.tap , this._loadPurchaseLink);
		}
	},
	
	updateButtonLoading: function()
	{
		if (!this.controller) return;
		var ub = this.controller.get('updateIcon');
		if (ub)
		{
			ub.addClassName('loading');
		}
	},
	
	updateButtonNormal: function()
	{
		var ub = this.controller.get('updateIcon');
		if (ub)
		{
			ub.removeClassName('loading');
		}
	},
	
	loadFullImage: function()
	{
		if (!this.model) return;
		this.controller.stageController.pushScene({name: 'display-pic' , transition: Mojo.Transition.crossFade} , {imageURL: this.model.detailimage});
	},
	
	loadPurchaseLink: function()
	{
		if (!this.model) return false;
		
		this.controller.serviceRequest('palm://com.palm.applicationManager' ,
                {
                  method: 'open',
                  parameters: {
                                id: 'com.palm.app.browser',
                                params: { target: this.model.purchaseurl }
                              }
                });
	},
	
	cacheWoot: function()
	{
		if (!this.model) return;
		
		WootOn.Cache.set(this.wootType() , this.model);
	}
	
	
	
});