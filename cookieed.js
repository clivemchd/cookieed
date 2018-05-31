'use strict';

/* Exposed Variable */
var userConsent  = {
  status : true
};

var CookieBanner = (function(){

  /* Private Variables */
  var btnActions        = ['accept', 'reject', 'settings'];
  var configTypeValues  = ['banner', 'tab'];
  var _defaultConfig = {
    "content"      : [{
      "type"        : "banner",
      "id"          : "banner-text-content",
      "class"       : "cbc-text-content",
      "template"    : "<p>We use cookies to improve your experience and analyze site usage. Read <a href='#' target='_blank'>Cookie Policy<a>.<p>"
    },{   
    "type"        : "tab",
    "id"          : "modal-tab-privacy", //unique identity
    "class"       : "",
    "position"    : 1, // only tab support
    "checkbox"    : true, // only tab support 
    "title"       : "Strict Cookies", // only tab support
    "template"    : "<p>These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. Without these cookies, some parts of our site or the service being requested will be impossible to provide.</p>",
    "enable"     : true, //only tab support
    "cookies"     : [{
      "key"     : "sad",
      "name"    : "asfa"
    },{
      "key"     : "dum",
      "name"    : "rimda"
    },{
      "key"     : "kum",
      "name"    : "safvfvfsvsd"
    }] // only tab support
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
    }],
    "cookie_name"  : {
      "name"    : "CookieBannerConsent",
      "expires" : 1,
    },
  };  
  var mergedConfig      = JSON.parse(JSON.stringify(_defaultConfig));

  /* User provided Callback */
  var _userCallback;
  
  /* Private utility Functions */
  var _util = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */
    
    // G //
    getCookieValueByName :function(name){
      var cookieName = name + "=";
      var cookieArray = decodeURIComponent(document.cookie).split(';');
      for(var i = 0; i <cookieArray.length; i++) {
        var cookieKey = cookieArray[i];
        while (cookieKey.charAt(0) == ' ') {
          cookieKey = cookieKey.substring(1);
        }
        if (cookieKey.indexOf(cookieName) == 0) {
          return cookieKey.split('=')[1];
        }
      }
      return "";
    },
    // I //
    isArrayEmpty  :function(data){
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
    // T // 
    toggleBanner : function(mergedConfig, btnAction){
      if(_util.validate.toHideBanner(mergedConfig.cookie_name.name) || btnAction === 'reject'){
        document.getElementById("cookie-banner-container").style.display = "none";
      }else{
        document.getElementById("cookie-banner-container").style.display = "block";        
      };
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
        return resOptions && resOptions.cookie_name && resOptions.cookie_name.name && resOptions.cookie_name.expires ? true : false;
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
      /// I ///
      ifCookieSet                 :function(resOptions){
        return _util.getCookieValueByName(resOptions) ? true :false;
      },
      /// S ///
      settingsConfig              :function(resOptions){
        return this.buttonConfig(resOptions) && this.contentConfig(resOptions) && this.cookieConfig(resOptions) && this.forContentConfig(resOptions) && this.forButtonConfig(resOptions) ? true : false;
      },
      /// T ///
      toHideBanner :function(cookieName){
        return _util.getCookieValueByName(cookieName) ? JSON.parse(_util.getCookieValueByName(cookieName)).action === 'accept' ? true : false : false;
      }
    },
  };

  /* exposed proxy functions */
  var _proxy = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */
    
    // D //
    DOMevent              :{
      buttons :function(btnSettings){
        _clickAction.saveConsent(btnSettings);
      }
    },
    // U //
    updateCookieName          :function(resOptions){
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
    updateButtonType          :function(resOptions){
      resOptions.map(function(buttonObject){
        _proxy.updateEachButtonType(buttonObject);
      });
    },
    updateContentType         :function(resOptions){
      resOptions.map(function(contentObject){
        _proxy.updateEachContentType(contentObject);
      });
    },
    updateSettingsConfig      :function(resOptions){
      var newResOptions = { "new_object" : resOptions, "merged_config" : mergedConfig };
      if(newResOptions.new_object.content && _util.validate.contentConfig(newResOptions.new_object)){
        this.updateContentType(newResOptions.new_object.content);         
      }
      if(newResOptions.new_object.button && _util.validate.buttonConfig(newResOptions.new_object)){
        this.updateButtonType(newResOptions.new_object.button);
      }
      if(newResOptions.new_object.cookie_name && _util.validate.cookieConfig(newResOptions.new_object)){
        this.updateCookieName(newResOptions.new_object.cookie_name);        
      }
    }
  };

  /* Private Functions */
  var _build = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */

    // B //
    bannerLayout        :function(config){
      _append.element({
        "element_tag" : "div",
        "element_id"  : "cookie-banner-container",
        "parent_tag"  : "body"
      });
      this.bannerTextWrapper(config);
      this.bannerButtonWrapper(config);
      this.bannerContent(config);
      this.bannerButtons(config);
    },
    bannerTextWrapper   :function(config){
      _append.element({
        "element_tag"   : "div",
        "element_id"    : "banner-text-wrapper",
        "element_class" : "cbc-text-wrapper",
        "parent_id"     : "cookie-banner-container"
      });
    },
    bannerButtonWrapper :function(config){
      _append.element({
        "element_tag"   : "div",
        "element_id"    : "banner-button-wrapper",
        "element_class" : "cbc-button-wrapper",
        "parent_id"     : "cookie-banner-container"
      });
    },
    bannerContent       :function(config){
      config.content.map(function(contentObj, index){
        contentObj.type === "banner" && _append.element({
          "element_tag"    : "div",
          "element_id"     : contentObj.id,
          "element_class"  : contentObj.class,
          "parent_id"      : "banner-text-wrapper",
          "template"       : contentObj.template
        });
      });
    },
    bannerButtons       :function(config){
      config.button.map(function(btnObj, index){
        var clickSettings = JSON.stringify({ 
          "type"          : btnObj.type, 
          "action"        : btnObj.action, 
          "id"            : btnObj.id,
          "user_consent"  : userConsent
        });
        btnObj.type === "banner" && btnObj.enable && _append.element({
          "element_tag"   : "button",
          "element_id"    : btnObj.id,
          "element_class" : btnObj.class,
          "element_click" : 'CookieBanner.DOMclickAction.buttons('+ clickSettings +')', //Pass an Array in a later release
          "parent_id"     : "banner-button-wrapper",
          "template"      : btnObj.title
        });
      });
    },
    // M //
    modalLayout         :function(config){
      _append.element({
        "element_tag"   : "div",
        "element_id"    : "modal-settings-wrapper",
        "element_class" : "cookie-settings-modal",
        "parent_tag"    : "body"
      });
      this.modalHeader(config);
      this.modalBody(config);
      this.modalFooter(config);
      this.modalHeaderText(config);
      this.modalHeaderButton(config);
      this.modalFooterButtons(config);
      _clickAction.closeModal({ "id" : "modal-settings-wrapper", "action" : "close" });
    },
    modalHeader         :function(config){
      _append.element({
        "element_tag"   : "div",
        "element_id"    : "modal-header",
        "element_class" : "csm-header",
        "parent_id"     : "modal-settings-wrapper"
      });
    },
    modalBody           :function(config){
      _append.element({
        "element_tag"   : "div",
        "element_id"    : "modal-body",
        "element_class" : "csm-body",
        "parent_id"     : "modal-settings-wrapper"
      });
    },
    modalFooter         :function(config){
      _append.element({
        "element_tag"   : "div",
        "element_id"    : "modal-footer",
        "element_class" : "csm-footer",
        "parent_id"     : "modal-settings-wrapper"
      });
    },
    modalHeaderText     :function(config){
      _append.element({
        "element_tag"   : "div",
        "element_id"    : "modal-header-text",
        "parent_id"     : "modal-header",
        "element_class" : "csm-header-text",
        "template"      : "<p>Privacy Preference Centre</p>",
      });
    },
    modalHeaderButton   :function(config){
      _append.element({
        "element_tag"   : "button",
        "element_id"    : "modal-button-close",
        "element_class" : "csm-button-close",
        "element_click" : 'CookieBanner.DOMclickAction.buttons({ "id" : "modal-settings-wrapper", "action" : "close" })', //Pass an Array in a later release
        "parent_id"     : "modal-header",
        "template"      : "X"
      });
    },
    modalFooterButtons  :function(config){
      config.button.map(function(btnObj, index){
        var clickSettings = JSON.stringify({ 
          "type"          : btnObj.type, 
          "action"        : btnObj.action,
          "id"            : btnObj.id,
          "user_consent"  : userConsent
        });
        btnObj.type === "tab" && btnObj.enable && _append.element({
          "element_tag"   : "button",
          "element_id"    : btnObj.id,
          "element_class" : btnObj.class,
          "element_click" : 'CookieBanner.DOMclickAction.buttons('+ clickSettings +')', //Pass an Array in a later release
          "parent_id"     : "modal-footer",
          "template"      : btnObj.title
        });
      });
    },
  };
  var _append = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */

    // E //
    element :function(resOptions){
      if(resOptions && Object.keys(resOptions).length && (resOptions.parent_tag || resOptions.parent_id) && resOptions.element_id && resOptions.element_tag){
        var parent = resOptions.parent_tag ? document.getElementsByTagName(resOptions.parent_tag)["0"] && document.getElementsByTagName(resOptions.parent_tag)["0"] : document.getElementById(resOptions.parent_id);
        var newElement = document.createElement(resOptions.element_tag);
        newElement.setAttribute('id', resOptions.element_id);
        resOptions.element_class && newElement.setAttribute('class', resOptions.element_class);
        resOptions.element_click && newElement.setAttribute('onclick', resOptions.element_click);       
        newElement.innerHTML = resOptions.template ? resOptions.template : "";
        parent && parent.appendChild(newElement);
      }
    }
  };
  var _clickAction = {
    /* Dear Maintainer, please arrange functions in alphabetical order makes it easier to find. */

    // C //
    closeModal  :function(eventSettings){
      if(eventSettings && eventSettings.id){
        document.getElementById(eventSettings.id).style.display = "none";    
      }
    },
    // O //
    openModal   :function(eventSettings){
      if(eventSettings && eventSettings.id){
        document.getElementById(eventSettings.id).style.display = "block";
      }
    },
    // S //
    saveConsent :function(eventSettings){            
      if(eventSettings && eventSettings.type && (eventSettings.type === 'banner' || eventSettings.type === 'tab') && eventSettings.action && (eventSettings.action === 'accept' || eventSettings.action === 'reject') && eventSettings.user_consent){
        var cookieValue     = JSON.stringify({ "action" : eventSettings.action, "user_consent": eventSettings.user_consent});
        var date            = new Date();
        var daysToSetCookie = mergedConfig.cookie_name.expires;
        date.setTime(date.getTime() + (daysToSetCookie * 24 * 60 * 60 * 1000));
        document.cookie = mergedConfig.cookie_name.name + "=" + cookieValue + "; expires=" + date.toGMTString();
        if(eventSettings.type === 'tab' && eventSettings.action === 'accept'){
          this.closeModal({ "id" : "modal-settings-wrapper", "action" : "close" });          
        }
        _userCallback(cookieValue);
      }
      if(eventSettings && eventSettings.type && eventSettings.type === 'banner' && eventSettings.action && eventSettings.action === 'settings' && eventSettings.user_consent){
        this.openModal({ "id" : "modal-settings-wrapper", "action" : eventSettings.action });
      }
      if(eventSettings && eventSettings.id && eventSettings.action === "close"){
        this.closeModal({ "id" : "modal-settings-wrapper", "action" : "close" });
      }
      _util.toggleBanner(mergedConfig, eventSettings.action);      
    }
  }

  /**
   * Inititalize the DOM on first load
   */
  function _init(callback){
    if(mergedConfig.content && mergedConfig.button && mergedConfig.cookie_name && _util.validate.settingsConfig(mergedConfig)){
      console.log("Initializing CookieBanner ...");
      _build.bannerLayout(mergedConfig);
      _build.modalLayout(mergedConfig);
      _util.toggleBanner(mergedConfig);
      console.log("Initialized CookieBanner");      
    };
    _userCallback = callback;
  };

  /* Set of functions exposed to the users */
  return {

    DOMclickAction   : {
      // B //
      buttons :function(btnSettings){
        _proxy.DOMevent.buttons(btnSettings);
      }
    },
    // I //
    init             :function(settings, callback){
      _proxy.updateSettingsConfig(settings);
      _init(callback);
    },
    // S //
    setCookieName    :function(reqOptions){
      _proxy.updateCookieName(reqOptions);          
    },
    setButton        :function(reqOptions){
      _proxy.updateEachButtonType(reqOptions);
    },
    setContent       :function(reqOptions){
      _proxy.updateEachContentType(reqOptions);
    },
    setImage         :function(){
      //Coming Soon
    }
  };

})();
