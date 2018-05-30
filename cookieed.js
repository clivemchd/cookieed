'use strict';

var CookieBanner = (function(){

  /* Private Variables */
  var _defaultConfig = {
    "content"      : [{
      "type"        : "banner",
      "id"          : "banner-text-content",
      "class"       : "cbc-text-content",
      "template"    : "<p>Built.io uses cookies to improve your experience and analyze site usage. Read <a href='#' target='_blank'>Cookie Policy<a>.<p>"
    }],
    "button"      : [{
      "type"        : "banner",
      "title"       : "Accept All Cookies",
      "action"      : "accept",     
      "id"          : "banner-button-accept",
      "class"       : "cbc-button-accept",
      "enable"      : true
    },{
      "type"        : "banner",
      "title"       : "X",
      "action"      : "reject",     
      "id"          : "banner-button-reject",
      "class"       : "cbc-button-reject",
      "enable"      : true
    },{
      "type"        : "banner",
      "title"       : "Cookie Settings",
      "action"      : "settings",     
      "id"          : "banner-button-settings",
      "class"       : "cbc-button-settings",
      "enable"      : false
    },{
      "type"        : "tab",
      "title"       : "Save Settings",
      "action"      : "accept",     
      "id"          : "modal-button-accept",
      "class"       : "csm-button-accept",
      "enable"      : false
    },],
    "cookie_name"  : {
      "name"    : "CookieBannerConsent",
      "expires" : 1,
    },
  };
  var btnActions        = ['accept', 'reject', 'settings'];
  var configTypeValues  = ['banner', 'tab'];  
  var mergedConfig      = JSON.parse(JSON.stringify(_defaultConfig));
  var userConsent       = {};
  
  /* Private utility Functions */
  var _util = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */
    
    // I //
    isArrayEmpty : function(data){
      return data && Array.isArray(data) && data.length ? false : true
    },
    insert  : {
      /// B ///
      btnInConfig             :function(data){
        mergedConfig.button.map(function(btnObject, index){
          if(btnObject.action === data.action && btnObject.type === data.type){
            mergedConfig.button.splice(index, 1, Object.assign(btnObject, data));
          }
        });
      },
      /// C ///
      contentInConfig         :function(data){
        mergedConfig.content.map(function(contentObject, index){
          if(contentObject.id === data.id && contentObject.type === data.type){
            mergedConfig.content.splice(index, 1, Object.assign(contentObject, data));
          };
        });
      }
    },
    // V //
    validate : {
      /// B ///
      buttonConfig                :function(resOptions){
        return resOptions && !_util.isArrayEmpty(resOptions.button) ? true : false;
      },
      btnActionValue(resOptions){
        return btnActions.indexOf(resOptions.action) > -1 ? true : false;
      },
      /// C ///
      contentConfig               :function(resOptions){
        return resOptions && !_util.isArrayEmpty(resOptions.content) ? true : false;
      },
      cookieConfig                :function(resOptions){
        return resOptions && resOptions.cookie_name && resOptions.cookie_name.name ? true : false;
      },
      configTypeValue             :function(resOptions){
        return configTypeValues.indexOf(resOptions.type) > -1 ? true : false;
      },
      contentByType               :function(resOptions){
        return resOptions.type === 'banner' ? resOptions.id && resOptions.template ? true : false : resOptions.id && resOptions.template && resOptions.position && resOptions.title && resOptions.enable && resOptions.cookies && this.contentByCookies(resOptions) && this.forContentCookiesConfig(resOptions) ? true : false;
      },
      contentByCookies            :function(resOptions){
        return resOptions && !_util.isArrayEmpty(resOptions.cookies) ? true : false;
      },
      /// F ///
      forEachBtnConfig            :function(resOptions){
        return Object.keys(resOptions).length && resOptions.action && resOptions.type && this.btnActionValue(resOptions) && this.configTypeValue(resOptions) ? true : false;
      },
      forEachContentConfig        :function(resOptions){
        return Object.keys(resOptions).length && resOptions.type && this.configTypeValue(resOptions) && this.contentByType(resOptions) ? true : false;
      },
      forEachContentCookiesConfig :function(resOptions){
        return Object.keys(resOptions).length && resOptions.key && resOptions.name ? true : false;        
      },
      forContentConfig            :function(resOptions){
        return resOptions.content.every(function(contentObject){
          return _util.validate.forEachContentConfig(contentObject);
        });
      },
      forButtonConfig             :function(resOptions){
        return resOptions.button.every(function(buttonObject){
          return _util.validate.forEachBtnConfig(buttonObject);
        });
      },
      forContentCookiesConfig     :function(resOptions){
        return resOptions.cookies.every(function(cookieObject){
          return _util.validate.forEachContentCookiesConfig(cookieObject);
        });
      },
      /// S ///
      settingsConfig              :function(resOptions){
        return this.buttonConfig(resOptions) && this.contentConfig(resOptions) && this.cookieConfig(resOptions) && this.forContentConfig(resOptions) && this.forButtonConfig(resOptions) ? true : false;
      }
    }
  };

  /* exposed proxy functions */
  var _proxy = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */
    
    // U //
    updateCookieName      :function(resOptions){
      var newResOptions = { "cookie_name" : resOptions };
      resOptions && Object.keys(resOptions).length && _util.validate.cookieConfig(newResOptions) && Object.assign(mergedConfig, newResOptions);
    },
    updateEachButtonType      :function(resOptions){
      var newResOptions = { "new_button_object" : resOptions, "merged_config" : mergedConfig };
      if(newResOptions.new_button_object && _util.validate.forEachBtnConfig(newResOptions.new_button_object)){
        _util.insert.btnInConfig(resOptions);
      };
    },
    updateEachContentType     :function(resOptions){
      var newResOptions = { "new_content_object" : resOptions, "merged_config" : mergedConfig };
      if(newResOptions.new_content_object && _util.validate.forEachContentConfig(newResOptions.new_content_object)){
        _util.insert.contentInConfig(resOptions);
      };
    },
    updateButtonType      :function(resOptions){
      resOptions.map(function(buttonObject){
        _proxy.updateEachButtonType(buttonObject);
      });
    },
    updateContentType     :function(resOptions){
      resOptions.map(function(contentObject){
        _proxy.updateEachContentType(contentObject);
      });
    },
    updateSettingsConfig  :function(resOptions){
      var newResOptions = { "new_object" : resOptions, "merged_config" : mergedConfig };
      if(newResOptions.new_object.content && newResOptions.new_object.button && newResOptions.new_object.cookie_name && _util.validate.settingsConfig(newResOptions.new_object)){
        this.updateCookieName(newResOptions.new_object.cookie_name);
        this.updateButtonType(newResOptions.new_object.button);
        this.updateContentType(newResOptions.new_object.content); 
      }
    }
  };

  /* Private Functions */
  var _build = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */

    // B //
    bannerLayout :function(){
      
    }
  };
  var _append = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */

    // E //
    element : function(resOptions){
      
    }
  };

  /**
   * Inititalize the DOM on first load
   */
  function _init(settings, callback){
    console.log("Initializing CookieBanner ...");

    console.log("Initialized CookieBanner");
  };

  /**
   * Set of functions exposed to the users
   */
  return {
    
    // I //
    init             :function(settings, callback){
      _proxy.updateSettingsConfig(settings, callback);
    },
    // S //
    setCookieName     :function(reqOptions){
      _proxy.updateCookieName(reqOptions);          
    },
    setButton         :function(reqOptions){
      _proxy.updateEachButtonType(reqOptions);
    },
    setContent        :function(reqOptions){
      _proxy.updateEachContentType(reqOptions);
    },
    setImage          :function(){
      //Coming Soon
    }
  };


})();
