sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  "use strict";
  return UIComponent.extend("local.sapui5.starter.Component", {
    metadata: { manifest: "json" },
    init: function () {
      UIComponent.prototype.init.apply(this, arguments);
      // manifest.json의 routes/targets를 읽고 현재 URL에 맞는 화면을 표시합니다.
      this.getRouter().initialize();
    }
  });
});
