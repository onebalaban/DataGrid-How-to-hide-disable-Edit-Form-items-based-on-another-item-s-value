$(function(){
    let rowKey = -1;
    gridInstance = $("#gridContainer").dxDataGrid({
        onEditorPreparing: function(e){
          if (e.dataField === "LastName" && e.parentType === "dataRow") {
            e.editorOptions.disabled = e.row.data && e.row.data.FirstName === "";
          }
        },
        onEditingStart: function(e){
          rowKey = e.key;
        },
        onInitNewRow: function(e){
          rowKey = -1;
          e.data.AddressRequired = false;
          e.data.FirstName = "";
        },
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        editing: {
          mode: "popup",
          allowAdding: true,
          allowUpdating: true,
          popup: {
            title: "Employee Info",
            showTitle: true,
            width: 700,
            height: 725,
            position: {
              my: "top",
              at: "top",
              of: "window"
            }
          },
          form: {
            customizeItem: function(item){
              if (item && item.itemType === "group" && item.caption === "Home Address") {
                let index = gridInstance.getRowIndexByKey(rowKey) || 0;
                index = index === -1 ? 0 : index ;
                let isVisible = gridInstance.cellValue(index, "AddressRequired");
                item.visible = isVisible;
              }
            },
            items: [
              {
                itemType: "group",
                colCount: 2,
                colSpan: 2,
                items: [
                  "FirstName",
                  "LastName",
                  "Prefix",
                  "BirthDate",
                  "Position",
                  "HireDate",
                  {
                    dataField: "Notes",
                    editorType: "dxTextArea",
                    colSpan: 2,
                    editorOptions: {
                      height: 100
                    }
                  }
                ]
              },
              {
                dataField: "AddressRequired",
                colSpan: 2
              },
              {
                itemType: "group",
                caption: "Home Address",
                colSpan: 2,
                colCount: 2,
                items: [
                  "StateID",
                  "Address"
                ]
              }
            ]
          }
        },
        columns: [
          {
            dataField: "Prefix",
            caption: "Title",
            width: 70
          },
          {
            dataField: "FirstName",
            setCellValue: function(newData, value) {
              this.defaultSetCellValue(newData, value)
            }
          },
          "LastName",
          {
            dataField: "BirthDate",
            dataType: "date"
          },
          {
            dataField: "Position",
            width: 170
          },
          {
            dataField: "HireDate",
            dataType: "date"
          },
          {
            dataField: "StateID",
            caption: "State",
            width: 125,
            lookup: {
              dataSource: states,
              displayExpr: "Name",
              valueExpr: "ID"
            }
          },
          {
            dataField: "Address",
            visible: false
          },
          {
            dataField: "Notes",
            visible: false
          },
          {
            dataField: "AddressRequired",
            setCellValue: function(newData, value) {
              this.defaultSetCellValue(newData, value)
            },
            visible: false
          }
        ]
    }).dxDataGrid("instance");
});