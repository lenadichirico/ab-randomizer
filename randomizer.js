var RedirectRandomizer = function () {

    /**
     * This is the only variable you need to edit.
     * List as many URLs as you need in array form and it'll randomize the redirect accordingly.
     * The first URL in the array will be the default page a visitor lands on.
     * This script will not work if the array count is 0.
    **/

    var redirectPaths = [
                            'index.html',
                            'index-b.html'
                        ];

    //  DO NOT EDIT BELOW THIS LINE

    var config = {
        'cookieName'   : 'spi-randomizer',
        'daysToExpire' : 30,
        'urlCount'     : redirectPaths.length,
		'cookieCount'  : 'spi-randomizer-count'
    }

    var _CookieUtil = {

        get: function(cookieName) {
            var nameEQ = cookieName + '=',
                ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        set: function (cookieName, cookieValue, daysToExpire) {
            if (daysToExpire) {
                var date = new Date();
                date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
                var expires = '; expires=' + date.toGMTString();
            } else {
                var expires = '';
            }
            document.cookie = cookieName + '=' + cookieValue + expires + '; path=/';
        },

        remove: function (cookieName) {
            _CookieUtil.set(cookieName, '', -1);
        }
        
    }

    function _checkCookie() {

		var betaPath = _getBetaPath();
				
		if (!betaPath) {
			if(_CookieUtil.get(config['cookieName']) == null) {
				_randomizeSetCookie();
			} else {
				if(_CookieUtil.get(config['cookieName']) != 'spi-0') {
					_redirectURL();
				}
			}	 
		}  
    }

    function _randomizeSetCookie() {

        var randomNumber = Math.random(),
            weight       = 1 / config['urlCount'];

        for(var i = 0; i < config['urlCount']; i++) {
            if(randomNumber >= weight * i && randomNumber < weight * (i + 1)) {
                 _CookieUtil.set(config['cookieName'], 'spi-' + i, config['daysToExpire']);
            }
        }
		
        if(_CookieUtil.get(config['cookieName']) != 'spi-0') {
            _redirectURL();
        }

    }

    function _redirectURL() {
	 
		 var rPath = window.location.pathname.split('/'),
			 emailTracking = window.location.href.split('?')[1],
		     location = '';
			 
		 if(emailTracking == 'hs308=email') {
            emailTracking = '?hs308=email';
         } else {
            emailTracking = '';
         }	 
			 
		 rPath[rPath.length - 1] = redirectPaths[Number(_CookieUtil.get(config['cookieName']).split('-')[1])];
		 location = 'http://' + window.location.hostname + rPath.join('/') + emailTracking;
		 
		 window.location = location;
		  
    }
	
	
	function _getBetaPath() {
	
		var rPath = window.location.pathname.split('/');
		var bPath = rPath[rPath.length - 1].split('-')[1];

		if (!bPath) {
			return false;
		} else {
			return true;
		}

	}
	
    this.init = function(){
        _checkCookie();
    }

}

var randomizer = new RedirectRandomizer();
randomizer.init();