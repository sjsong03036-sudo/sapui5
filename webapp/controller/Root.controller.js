sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
  "use strict";
  return Controller.extend("local.sapui5.starter.controller.Root", {
    onInit: function () {
      this._oNavigationModel = new JSONModel({ current: "view1" });
      this.getView().setModel(this._oNavigationModel, "navigation");
      this._oRouter = this.getOwnerComponent().getRouter();
      this._oRouter.attachRoutePatternMatched(this._onRouteMatched, this);
      this._oRouter.attachBypassed(this._onBypassed, this);
    },

    onNavigate: function (oEvent) {
      // 버튼의 route 값은 manifest의 경로 이름입니다. navTo로 URL과 화면을 바꿉니다.
      this._oRouter.navTo(oEvent.getSource().data("route"));
    },

    _onRouteMatched: function (oEvent) {
      var sName = oEvent.getParameter("name");
      this._oNavigationModel.setProperty("/current", sName === "home" ? "view1" : sName);
    },

    _onBypassed: function () {
      // 정의되지 않은 URL은 기록을 추가하지 않고 View1으로 이동합니다.
      this._oRouter.navTo("view1", {}, true);
    },

    onExit: function () {
      this._oRouter.detachRoutePatternMatched(this._onRouteMatched, this);
      this._oRouter.detachBypassed(this._onBypassed, this);
      this._oNavigationModel.destroy();
    }
  });
});
