sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/FilterType",
  "sap/m/MessageBox"
], function (Controller, JSONModel, Filter, FilterOperator, FilterType, MessageBox) {
  "use strict";

  return Controller.extend("local.sapui5.starter.controller.View4", {
    onInit: function () {
      // 1. 검색조건 모델: 입력값과 선택한 key를 저장합니다 (기본 TwoWay 바인딩).
      var oSearchModel = new JSONModel({ keyword: "", category: "", status: "" });
      // 2. 선택지 모델: ComboBox와 Select의 목록을 저장합니다.
      var oOptionsModel = new JSONModel({ categories: [], statuses: [] });
      // 3. 결과 모델: 테이블에 표시할 상품 원본을 저장합니다.
      var oResultModel = new JSONModel({ products: [] });
      this.getView().setModel(oSearchModel, "search");
      this.getView().setModel(oOptionsModel, "options");
      this.getView().setModel(oResultModel, "result");
      this._aModels = [oSearchModel, oOptionsModel, oResultModel];

      // 서로 다른 JSON 파일을 각각의 모델에 비동기로 읽습니다.
      oOptionsModel.attachRequestFailed(function () {
        MessageBox.error("검색 선택지를 불러오지 못했습니다.");
      });
      oResultModel.attachRequestFailed(function () {
        MessageBox.error("상품 데이터를 불러오지 못했습니다.");
      });
      oOptionsModel.loadData(sap.ui.require.toUrl("local/sapui5/starter/model/searchOptions.json"));
      oResultModel.loadData(sap.ui.require.toUrl("local/sapui5/starter/model/searchProducts.json"));
    },

    onSearch: function () {
      // ComboBox는 자유 입력도 허용하므로, 목록에 없는 값은 검색 전에 확인합니다.
      var oCategory = this.byId("categoryCombo");
      if (oCategory.getValue() && !oCategory.getSelectedItem()) {
        oCategory.setValueState("Error");
        oCategory.setValueStateText("목록에서 분류를 선택하세요.");
        return;
      }
      oCategory.setValueState("None");

      var oCriteria = this.getView().getModel("search").getData();
      var aFilters = [];
      var sKeyword = oCriteria.keyword.trim();
      if (sKeyword) {
        aFilters.push(new Filter("name", FilterOperator.Contains, sKeyword));
      }
      if (oCriteria.category) {
        aFilters.push(new Filter("category", FilterOperator.EQ, oCriteria.category));
      }
      if (oCriteria.status) {
        aFilters.push(new Filter("status", FilterOperator.EQ, oCriteria.status));
      }
      // AND로 결합하여 모든 조건을 만족하는 행만 표시합니다.
      // 데이터 재요청 없이 이미 loadData로 읽은 JSONModel을 클라이언트에서 필터링합니다.
      // result 모델 원본은 유지하며 테이블의 items 바인딩만 필터링합니다.
      this.byId("resultTable").getBinding("items").filter(
        aFilters.length ? [new Filter({ filters: aFilters, and: true })] : [],
        FilterType.Application
      );
    },

    onReset: function () {
      this.getView().getModel("search").setData({ keyword: "", category: "", status: "" });
      this.byId("categoryCombo").setValueState("None");
      this.byId("resultTable").getBinding("items").filter([], FilterType.Application);
    },

    onExit: function () {
      this._aModels.forEach(function (oModel) { oModel.destroy(); });
    }
  });
});
