BaseTab = Class.create({
	navOffset: false,
	
	initialize: function(o)
	{
		var o = o || {};
		this.navOffset = o.navOffset || "0px";
		this.initListeners();
		this.doInitialize();
	},
	
	initListeners: function()
	{
		this._scrollToTop = this.scrollToTop.bindAsEventListener(this);
	},
	
	setup: function()
	{
		this.initNav();
		this.doSetup();
		
		var landscape = WootOn.Preferences.getLandscapeSettings();
		if (landscape.gestures)
		{
			this.controller.useLandscapePageUpDown(true);
		}
	},
	
	cleanup: function()
	{
		this.cleanupNav();
		this.doCleanup();
	},
	
	activate: function(e)
	{
		WootOn.activeNav.activate();
		this.doActivate();
		
		var main = this.controller.getSceneScroller().down("div#main");
		if (main)
		{
			main.observe(Mojo.Event.tap , this._scrollToTop);
		}
	},
	
	deactivate: function(e)
	{
		WootOn.activeNav.deactivate();
		this.doDeactivate();
		
		var main = this.controller.getSceneScroller().down("div#main");
		if (main)
		{
			main.stopObserving(Mojo.Event.tap , this._scrollToTop);
		}
	},
	
	initNav: function()
	{
		if (!WootOn.activeNav)
		{
			WootOn.activeNav = new WootOn.Nav(this.controller.sceneName);
		}
		else
		{
			WootOn.activeNav.initHighlight(this.controller.sceneName);
		}
		WootOn.activeNav.addCallBack(this.navClick.bind(this));
		this.controller.getSceneScroller().appendChild(WootOn.activeNav.DOM);
		
		WootOn.activeNav.setSizing();
		if (this.navOffset)
		{
			WootOn.activeNav.setOffset(this.navOffset);
		}
	},
	
	cleanupNav: function()
	{
		WootOn.activeNav.DOM.remove();
	},
	
	navClick: function(e)
	{
		var el = e.srcElement || e.target;
		if (el.assistant == this.controller.sceneName) return false;
		WootOn.activeNav.addHighlight(el.assistant);
		if (this.doNavSwitch)
		{
			window.clearTimeout(this.doNavSwitch);
		}
		this.doNavSwitch = window.setTimeout(this.navSwitch.bind(this , el.assistant) , 420);
	},
	
	navSwitch: function(scene , o)
	{
		var options = {user:this.user , navOffset: WootOn.activeNav.getOffset()};
		var o = o || {};
		var options = Object.extend(options , o);
		this.controller.stageController.swapScene({name: scene , transition: Mojo.Transition.crossFade} , options);
	},
	
	errorDialog: function(msg , cb)
	{
		if (!msg) return false;
		var cb = cb || function(){};
		this.dialog('Error' , msg , cb);
	},
	
	dialog: function(title , msg , cb)
	{
		if (!title || !msg) return false;
		var cb = cb || function(){};
		
		this.controller.showAlertDialog({
		    onChoose: cb ,
		    title: $L(title),
		    message: $L(msg),
		    choices:[
		         {label:$L('continue')} 
		    ]
		   });
	},
	
	scrollToTop: function()
	{
		this.controller.getSceneScroller().mojo.scrollTo(0 , 0 , true , false);
	},
	
	handleCommand: function(event)
	{
		this.doHandleCommand(event);
	},
	
	doHandleCommand: function(event)
	{
		if (event.type == Mojo.Event.commandEnable && (event.command == Mojo.Menu.helpCmd || event.command == Mojo.Menu.prefsCmd)) 
		{
         	event.stopPropagation(); // enable help. now we have to handle it
		}
		
		if (event.type == Mojo.Event.command) 
		{
			switch (event.command) 
			{
				case Mojo.Menu.helpCmd:
					this.controller.stageController.pushScene('support');
				break;
				
				case Mojo.Menu.prefsCmd:
					this.controller.stageController.pushScene('settings');
				break;			
				
			}
		}
	},
	
	orientationChanged: function(orientation)
	{
		var landscape = WootOn.Preferences.getLandscapeSettings();
		if (this._orientation === orientation || !landscape.enabled)
		{
			return;
		}
		
		this._orientation = orientation;
		this.controller.window.PalmSystem.setWindowOrientation(this._orientation);
		if (WootOn.activeNav && WootOn.activeNav.resetSizing)
		{
			WootOn.activeNav.resetSizing();
		}
	},
	
	doInitialize: function(){},
	doSetup: function(){},
	doCleanup: function(){},
	doActivate: function(){},
	doDeactivate: function(){},
});