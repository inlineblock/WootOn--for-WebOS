WootOn.Notifications = Class.create({
});


WootOn.Notifications.stageName = 'notifications';
WootOn.Notifications.alarmKey = '_notifier';
WootOn.Notifications.enable = function()
{
	var notify = WootOn.Preferences.getNotificationSettings();
	if (!notify.enabled) return false;
	
	var alarm = Delicious.Date.getNextWootTime();
	var atTime = Delicious.Date.convertDateToAlarm(alarm);
	Mojo.Log.info('fire alarm at: ' , atTime);
	var params = {'id': Mojo.Controller.appInfo.id , 'params':{checkForUpdates:true}};
	var request = new Mojo.Service.Request('palm://com.palm.power/timeout', {
		method: "set",
		parameters: {
			wakeup: true ,
			key: WootOn.Notifications.alarmKey ,
			uri: "palm://com.palm.applicationManager/launch",
			"params": params ,
			"at": atTime
			}
	});
}

WootOn.Notifications.disable = function()
{
	var notify = WootOn.Preferences.getNotificationSettings();
	if (notify.enabled) return false;
	
	var request = new Mojo.Service.Request('palm://com.palm.power/timeout', {
			method: "clear",
			parameters: { 'key': WootOn.Notifications.alarmKey }
	});
}

WootOn.Notifications.close = function()
{
	if (WootOn.StageManager.stageExists(WootOn.Notifications.stageName))
	{
		WootOn.StageManager.close(WootOn.Notifications.stageName);
	}
}