WootOn = {
	getFeedURL: function(type)
	{
		var cookie = new Mojo.Model.Cookie('nduid');
		var url = "http://www.deliciousmorsel.com/cache/%action%?uuid=%unique%&version=%version%&device=pre"
		var url = url.replace("%action%" , type);
		var url = url.replace("%version%" , Mojo.Controller.appInfo.version);
		var url = url.replace("%unique%" , cookie.get() || "none");
		return url;
	}
};