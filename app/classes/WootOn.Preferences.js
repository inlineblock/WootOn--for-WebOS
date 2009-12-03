WootOn.Preferences = {	
	initAllPreferences: function()
	{
		if (!WootOn.Preferences.cookie)
		{
			WootOn.Preferences.Cookie = new Mojo.Model.Cookie('WootOnAllPreferences');
		}
		WootOn.Preferences.settings = WootOn.Preferences.Cookie.get();
		WootOn.Preferences.settings = WootOn.Preferences.settings || {};
	},
	
	saveAll: function()
	{
		WootOn.Preferences.Cookie.put(WootOn.Preferences.settings);
	},
	
	getLandscapeSettings: function()
	{
		WootOn.Preferences.initAllPreferences();
		var settings = WootOn.Preferences.settings.landscape || {enabled:true,gestures:true} , ret = {};
		if (settings.enabled)
		{
			ret.enabled = true;
		}
		else
		{
			ret.enabled = false;
		}
		
		if (settings.gestures)
		{
			ret.gestures = true;
		}
		else
		{
			ret.gestures = false;
		}
		//Mojo.Log.info('-------getLandscapeSettings' , Object.toJSON(ret));
		return ret;
	},
	
	setLandscapeSettings: function(settings)
	{
		var set = {} , settings = settings || {};
		if (settings.enabled)
		{
			set.enabled = true;
		}
		else
		{
			set.enabled = false;
		}
		
		if (settings.gestures)
		{
			set.gestures = true;
		}
		else
		{
			set.gestures = false;
		}
		
		//Mojo.Log.info('-------setLandscapeSettings' , Object.toJSON(set));
		WootOn.Preferences.settings.landscape = set;
		WootOn.Preferences.saveAll();
	},
	
	
	/// NOTIFICATIONS
	
	getNotificationSettings: function()
	{
		WootOn.Preferences.initAllPreferences();
		var settings = WootOn.Preferences.settings.notifications || {enabled:false , vibrate: true , woot: true , shirt: false , wine: false , sellout: false, kids: false} , ret = {};
		
		if (settings.enabled)
		{
			ret.enabled = true;
		}
		else
		{
			ret.enabled = false;
		}
		
		
		if (settings.vibrate)
		{
			ret.vibrate = true;
		}
		else
		{
			ret.vibrate = false;
		}
		if (settings.woot)
		{
			ret.woot = true;
		}
		else
		{
			ret.woot = false;
		}
		if (settings.shirt)
		{
			ret.shirt = true;
		}
		else
		{
			ret.shirt = false;
		}
		if (settings.wine)
		{
			ret.wine = true;
		}
		else
		{
			ret.wine = false;
		}
		if (settings.sellout)
		{
			ret.sellout = true;
		}
		else
		{
			ret.sellout = false;
		}
		if (settings.kids)
		{
			ret.kids = true;
		}
		else
		{
			ret.kids = false;
		}

		
		return ret;
	},
	
	setNotificationSettings: function(settings)
	{
		var set = {} , settings = settings || {};
		if (settings.enabled)
		{
			set.enabled = true;
		}
		else
		{
			set.enabled = false;
		}
		
		
		if (settings.vibrate)
		{
			set.vibrate = true;
		}
		else
		{
			set.vibrate = false;
		}
		if (settings.woot)
		{
			set.woot = true;
		}
		else
		{
			set.woot = false;
		}
		if (settings.shirt)
		{
			set.shirt = true;
		}
		else
		{
			set.shirt = false;
		}
		if (settings.wine)
		{
			set.wine = true;
		}
		else
		{
			set.wine = false;
		}
		if (settings.sellout)
		{
			set.sellout = true;
		}
		else
		{
			set.sellout = false;
		}
		if (settings.kids)
		{
			set.kids = true;
		}
		else
		{
			set.kids = false;
		}
		
		//Mojo.Log.info('-------setNotificationSettings' , Object.toJSON(set));
		WootOn.Preferences.settings.notifications = set;
		WootOn.Preferences.saveAll();
	}
};