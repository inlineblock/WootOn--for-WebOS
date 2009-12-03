Delicious.Date = {
	months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
	isDST: function()
	{
		var d = new Date() ,
			dY = d.getFullYear() ,
			d1 = new Date(dY,0,1,0,0,0,0) , 
			d2 = new Date(dY,6,1,0,0,0,0) ,
			d1a = new Date((d1.toUTCString()).replace(" GMT","")) ,
			d2a = new Date((d2.toUTCString()).replace(" GMT","")) ,
			o1 = (d1-d1a)/3600000 ,
			o2 = (d2-d2a)/3600000 ,
			rV = 0;
		
		if (o1!=o2) 
		{
			d.setHours(0);d.setMinutes(0);d.setSeconds(0);d.setMilliseconds(0);
			var da=new Date((d.toUTCString()).replace(" GMT",""));
			o3 = (d-da)/3600000;		
			rV = (o3==o1) ? 0 : 1;
		}
		return rV;
	},
	
	getGMTOffsetString: function()
	{
		if (Delicious.Date.isDST())
		{
			return 'GMT-0500';
		}
		else
		{
			return 'GMT-0600';
		}
	},
	
	getNextWootTime: function()
	{
		 var now = new Date(),
		 	 texas = Delicious.Date.months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear().toString() + ' 00:03:00 ' + Delicious.Date.getGMTOffsetString(),
		 	 todaysWoot = new Date(texas);
		 
		 while (now > todaysWoot)
		 {
		 	todaysWoot = new Date(todaysWoot.getTime() + 86400000);
		 }
		 return todaysWoot;
	},
	
	convertDateToAlarm: function(date)
	{
		var month = (date.getUTCMonth()+1).toString(),
			day = date.getUTCDate().toString(),
			year = date.getUTCFullYear().toString(),
			hours = date.getUTCHours().toString(),
			minutes = date.getUTCMinutes().toString(),
			seconds = date.getUTCSeconds().toString();
		
		if (month.length != 2)
		{
			month = "0" + month;
		}
		if (day.length != 2)
		{
			day = "0" + day;
		}
		if (hours.length != 2)
		{
			hours = "0" + hours;
		}
		if (minutes.length != 2)
		{
			minutes = "0" + minutes;
		}
		if (seconds.length != 2)
		{
			seconds = "0" + seconds;
		}
		return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
	}
}