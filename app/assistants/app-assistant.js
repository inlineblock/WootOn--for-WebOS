AppAssistant = Class.create({
	
	initialize: function(appController)
	{
		this.nduid  = new Mojo.Model.Cookie('nduid');
	},
	
	setup: function()
	{
		WootOn.Cache = new WootOn.Cacher();
		WootOn.StageManager = new Delicious.StageManager(this.controller);
		this.fireTracking();
	},
	
	handleLaunch: function(o)
	{
		var o = o || {};
		if (o.checkForUpdates)
		{
			Mojo.Log.info('--------WootON::checkForUpdates');
			WootOn.StageManager.newDashboard('CheckNotifications');
		}
		else
		{
			WootOn.StageManager.newCard('woot');
		}
	},
	
	fireTracking: function()
	{
		var s = s_gi(Mojo.Controller.appInfo.reportSuite);
		s.pageName = Mojo.Controller.appInfo.title + " Launched";
		s.prop1 = Mojo.Controller.appInfo.title;
		s.eVar1 = Mojo.Controller.appInfo.title;
		s.prop2 = Mojo.Controller.appInfo.version;
		s.eVar2 = Mojo.Controller.appInfo.version;
		s.prop3 = "Palm Pre";
		s.eVar3 = "Palm Pre";
		var nduid = this.nduid.get();
		if (nduid)
		{
			s.vID = nduid;
		}
		else
		{
			new Mojo.Service.Request('palm://com.palm.preferences/systemProperties', {
		   		method:"Get",
		   		parameters:{"key": "com.palm.properties.nduid" },
		  		onSuccess: this.storeNduid.bind(this)
			});
		}
		s.t();		
	},
	
	storeNduid: function(id)
	{
		this.nduid.put(id['com.palm.properties.nduid']);
	}

});