sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
  "use strict";

  return Controller.extend("local.sapui5.starter.controller.View3", {
    onInit: function () {
      var oModel = new JSONModel({ orders: [] });
      this.getView().setModel(oModel, "order");
      this._oOrdersModel = oModel;

      // 엘리먼트 바인딩: 상세 영역 전체의 기준 객체를 첫 주문으로 지정합니다.
      // 자식들은 이 컨텍스트를 상속하므로 /orders/0을 반복해서 적지 않습니다.
      this.byId("orderDetail").bindElement({
        path: "/orders/0",
        model: "order"
      });

      oModel.attachRequestFailed(function () {
        MessageBox.error("연습용 주문 데이터를 불러오지 못했습니다.");
      });
      oModel.loadData(sap.ui.require.toUrl("local/sapui5/starter/model/orders.json"));
    },

    onOrderChange: function (oEvent) {
      var sIndex = oEvent.getSource().getSelectedKey();
      // 부모의 기준 객체만 바꾸면 상세 필드와 두 테이블이 함께 바뀝니다.
      this.byId("orderDetail").bindElement({
        path: "/orders/" + sIndex,
        model: "order"
      });
    },

    onExit: function () {
      this._oOrdersModel.destroy();
    }
  });
});
