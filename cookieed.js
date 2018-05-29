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
    }],
    // "cookie_name"  : {},
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
      btnInConfig :function(data){
        mergedConfig.button.map(function(btnObject, index){
          if(_util.validate.btnActionValue(data) && _util.validate.configTypeValue(data)){
            if(btnObject.action === data.action && btnObject.type === data.type){
              mergedConfig.button.splice(index, 1, data);                            
            }else{
              mergedConfig.button.push(data);              
            };
          };
        });
        
      },  
      
    },
    // V //
    validate : {
      /// B ///
      buttonConfig        :function(resOptions){
        return resOptions && !_util.isArrayEmpty(resOptions.button) ? true : false;
      },
      btnActionValue(resOptions){
        return btnActions.indexOf(resOptions.action) > -1 ? true : false;
      },
      /// C ///
      contentConfig       :function(resOptions){
        return resOptions && !_util.isArrayEmpty(resOptions.content) ? true : false;
      },
      cookieConfig        :function(resOptions){
        return resOptions && resOptions.cookie_name && resOptions.cookie_name.name ? true : false;
      },
      configTypeValue     :function(resOptions){
        return configTypeValues.indexOf(resOptions.type) > -1 ? true : false;
      },
      /// F ///
      forEachBtnConfig    :function(resOptions){
        return Object.keys(resOptions).length && resOptions.action && resOptions.type ? true :false; 
      },
      /// S ///
      settingsConfig      :function(resOptions){
        return this.buttonConfig(resOptions) && this.contentConfig(resOptions) && this.cookieConfig(resOptions) ? true : false;
      }
    }
  };

  /* exposed proxy functions */
  var _proxy = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */
    
    // U //
    updateCookieName  :function(resOptions){
      var newResOptions = { "cookie_name" : resOptions };
      resOptions && Object.keys(resOptions).length && _util.validate.cookieConfig(newResOptions) && Object.assign(mergedConfig, newResOptions);
    },
    updateButtonType  :function(resOptions){
      var newResOptions = { "new_button_object" : resOptions, "merged_config" : mergedConfig }
      if(newResOptions.new_button_object && _util.validate.forEachBtnConfig(newResOptions.new_button_object)){
        _util.insert.btnInConfig(resOptions);
      };
    },
    updateContentType :function(){

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
    // _util.validate.settingsConfig(settings);
    // _build.bannerLayout();
    
    // return callback(userConsent); 
    console.log("Initialized CookieBanner");
  };

  /**
   * Set of functions exposed to the users
   */
  return {
    
    // I //
    init             :function(settings, callback){
      _init(settings, callback);
    },
    // S //
    setCookieName     :function(reqOptions){
      _proxy.updateCookieName(reqOptions);          
    },
    setButton         :function(reqOptions){
      _proxy.updateButtonType(reqOptions);
    },
    setContent        :function(){

    },
    setImage          :function(){
      //Coming Soon
    }
  };


})();
