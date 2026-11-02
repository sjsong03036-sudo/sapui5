sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
  "use strict";

  return Controller.extend("local.sapui5.starter.controller.View2", {
    onInit: function () {
      // JSON 구조는 { products: [...] }입니다. 배열 경로는 /products입니다.
      var oModel = new JSONModel({ products: [] });

      // View에 이름이 shop인 모델을 설정합니다. 자식 컨트롤에도 상속됩니다.
      // XML에서는 모델 이름을 포함해 {shop>/products}, {shop>name}으로 참조합니다.
      this.getView().setModel(oModel, "shop");
      this._oProductsModel = oModel;

      oModel.attachRequestFailed(function () {
        MessageBox.error("연습용 상품 데이터를 불러오지 못했습니다.");
      });

      // 앱의 리소스 경로를 URL로 변환한 뒤 JSON을 비동기로 읽습니다.
      // 로딩이 끝나면 같은 모델을 사용하는 두 테이블이 자동으로 갱신됩니다.
      oModel.loadData(sap.ui.require.toUrl("local/sapui5/starter/model/products.json"));
    },

    onExit: function () {
      // 이 컨트롤러에서 만든 모델은 View가 종료될 때 정리합니다.
      this._oProductsModel.destroy();
    }
  });
});
