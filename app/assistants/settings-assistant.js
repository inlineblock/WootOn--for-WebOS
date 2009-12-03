SettingsAssistant = Class.create({

	initialize: function()
	{
		this._landscapeChange = this.landscapeChange.bindAsEventListener(this);
		this._notificationsChange = this.notificationsChange.bindAsEventListener(this);
	},
	
	
	setup: function()
	{
		var landscape = WootOn.Preferences.getLandscapeSettings();
		this.landscapeModeModel = {value: landscape.enabled};
		if (landscape.enabled)
		{
			this.activateLandscape();
		}
		else
		{
			this.deactivateLandscape();
		}
		this.controller.setupWidget('landscapeModeToggle' , { trueValue: true , falseValue: false } , this.landscapeModeModel);
		this.scrollGesturesModel = {value: landscape.gestures};
		this.controller.setupWidget('scrollGesturesToggle' , { trueValue: true , falseValue: false } , this.scrollGesturesModel);
		
		var notify = WootOn.Preferences.getNotificationSettings();
		this.notificationsEnabledModel = {value: notify.enabled};
		
		if (notify.enabled)
		{
			this.activateNotifications();
		}
		else
		{
			this.deactivateNotifications();
		}
		this.controller.setupWidget('enableNotificationsToggle' , { trueValue: true , falseValue: false } , this.notificationsEnabledModel);
		
		this.vibrateNotificationsModel = {value: notify.vibrate};
		this.controller.setupWidget('vibrateNotificationsToggle' , { trueValue: true , falseValue: false } , this.vibrateNotificationsModel);
		this.wootNotificationsModel = {value: notify.woot};
		this.controller.setupWidget('wootNotificationsToggle' , { trueValue: true , falseValue: false } , this.wootNotificationsModel);
		this.shirtNotificationsModel = {value: notify.shirt};
		this.controller.setupWidget('shirtNotificationsToggle' , { trueValue: true , falseValue: false } , this.shirtNotificationsModel);
		this.selloutNotificationsModel = {value: notify.sellout};
		this.controller.setupWidget('selloutNotificationsToggle' , { trueValue: true , falseValue: false } , this.selloutNotificationsModel);
		this.kidsNotificationsModel = {value: notify.kids};
		this.controller.setupWidget('kidsNotificationsToggle' , { trueValue: true , falseValue: false } , this.kidsNotificationsModel);
		this.wineNotificationsModel = {value: notify.wine};
		this.controller.setupWidget('wineNotificationsToggle' , { trueValue: true , falseValue: false } , this.wineNotificationsModel);
	},
	
	activate: function()
	{
		var landscapeModeToggle = this.controller.get('landscapeModeToggle');
		landscapeModeToggle.observe(Mojo.Event.propertyChange, this._landscapeChange);
		var scrollGesturesToggle = this.controller.get('scrollGesturesToggle');
		scrollGesturesToggle.observe(Mojo.Event.propertyChange, this._landscapeChange);
		
		this.controller.get('enableNotificationsToggle').observe(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('vibrateNotificationsToggle').observe(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('wootNotificationsToggle').observe(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('shirtNotificationsToggle').observe(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('selloutNotificationsToggle').observe(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('kidsNotificationsToggle').observe(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('wineNotificationsToggle').observe(Mojo.Event.propertyChange, this._notificationsChange);
	},
	
	deactivate: function()
	{
		
		var landscapeModeToggle = this.controller.get('landscapeModeToggle');
		landscapeModeToggle.stopObserving(Mojo.Event.propertyChange, this._landscapeChange);
		var scrollGesturesToggle = this.controller.get('scrollGesturesToggle');
		scrollGesturesToggle.stopObserving(Mojo.Event.propertyChange, this._landscapeChange);
		
		this.controller.get('enableNotificationsToggle').stopObserving(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('vibrateNotificationsToggle').stopObserving(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('wootNotificationsToggle').stopObserving(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('shirtNotificationsToggle').stopObserving(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('selloutNotificationsToggle').stopObserving(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('kidsNotificationsToggle').stopObserving(Mojo.Event.propertyChange, this._notificationsChange);
		this.controller.get('wineNotificationsToggle').stopObserving(Mojo.Event.propertyChange, this._notificationsChange);
		
	},
	
	landscapeChange: function()
	{
		var settings = {enabled: this.landscapeModeModel.value , gestures: this.scrollGesturesModel.value};
		WootOn.Preferences.setLandscapeSettings(settings);
		
		if (settings.enabled)
		{
			this.activateLandscape();
		}
		else
		{
			this.deactivateLandscape();
		}
	},
	
	notificationsChange: function()
	{
		var settings = {enabled: this.notificationsEnabledModel.value ,
						vibrate: this.vibrateNotificationsModel.value ,
						woot: this.wootNotificationsModel.value  ,
						shirt: this.shirtNotificationsModel.value , 
						wine: this.wineNotificationsModel.value , 
						kids: this.kidsNotificationsModel.value , 
						sellout: this.selloutNotificationsModel.value
						};
		WootOn.Preferences.setNotificationSettings(settings);
		
		if (settings.enabled)
		{
			this.activateNotifications();
			WootOn.Notifications.enable();
		}
		else
		{
			this.deactivateNotifications();
			WootOn.Notifications.disable();
		}
	},
	
	activateNotifications: function()
	{
		Mojo.Log.info('activateNotifications');
		this.controller.get('notificationsFirst').removeClassName('last');
		this.controller.get('notificationGroup').show();
	},
	
	deactivateNotifications: function()
	{
		Mojo.Log.info('deactivateNotifications');
		this.controller.get('notificationsFirst').addClassName('last');
		this.controller.get('notificationGroup').hide();
	},
	
	activateLandscape: function()
	{
		this.controller.get('landscapeFirst').removeClassName('last');
		this.controller.get('landscapeLast').addClassName('last').show();
	},
	
	deactivateLandscape: function()
	{
		this.controller.get('landscapeFirst').addClassName('last');
		this.controller.get('landscapeLast').removeClassName('last').hide();
	}
	
});