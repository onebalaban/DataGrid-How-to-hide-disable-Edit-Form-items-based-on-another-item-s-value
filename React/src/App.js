import React from 'react';
import './App.css';

import service from './data';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import config from 'devextreme/core/config';
import 'devextreme-react/text-area';

import DataGrid, { 
  Column,
  Lookup,
  Form,
  Popup,
  Paging,
  Editing
} from 'devextreme-react/data-grid';
import { SimpleItem, GroupItem } from 'devextreme-react/form';

class App extends React.Component {
  constructor(props) {
    super(props);
    config({
      editorStylingMode: 'filled'
    });
    this.dataSource = service.getEmployees();
    this.states = service.getStates();
    this.rowKey = -1;
    this.dataGrid = React.createRef();
    this.popupPosition = { my: 'top', at: 'top', of: window };
    this.editorOptions = { height: 100 };
  }
  render() {
    return (
      <div className="App">
        <DataGrid ref={this.dataGrid} onEditorPreparing={this.onEditorPreparing} onEditingStart={this.onEditingStart}
          onInitNewRow={this.onInitNewRow} dataSource={this.dataSource} keyExpr={"ID"} showBorders={true}>
          <Paging enabled={false} />
          <Editing mode={"popup"} allowAdding={true} allowUpdating={true}>
            <Popup title={"Employee Info"} showTitle={true} width={700} height={725}
              position={this.popupPosition}>
            </Popup>
            <Form customizeItem={this.customizeItem}>
              <GroupItem colCount={2} colSpan={2}>
                <SimpleItem dataField={"FirstName"} />
                <SimpleItem dataField={"LastName"} />
                <SimpleItem dataField={"Prefix"} />
                <SimpleItem dataField={"BirthDate"} />
                <SimpleItem dataField={"Position"} />
                <SimpleItem dataField={"HireDate"} />
                <SimpleItem dataField="Notes" editorType={"dxTextArea"} colSpan={2} editorOptions={this.editorOptions} />
              </GroupItem>
              <SimpleItem dataField={"AddressRequired"} colSpan={2} />
              <GroupItem caption={"Home Address"} colCount={2} colSpan={2}>
                <SimpleItem dataField={"StateID"} />
                <SimpleItem dataField={"Address"} />
              </GroupItem>
            </Form>
          </Editing>
          <Column dataField={"Prefix"} caption={"Title"} width={70} />
          <Column dataField={"FirstName"} setCellValue={this.setCellValue} />
          <Column dataField={"LastName"} />
          <Column dataField={"BirthDate"} dataType={"date"} />
          <Column dataField={"Position"} width={170} />
          <Column dataField={"HireDate"} dataType={"date"} />
          <Column dataField={"StateID"} caption={"State"} width={125}>
            <Lookup dataSource={this.states} displayExpr={"Name"} valueExpr={"ID"}>
            </Lookup>
          </Column>
          <Column dataField={"Address"} visible={false} />
          <Column dataField={"Notes"} visible={false} />
          <Column dataField={"AddressRequired"} setCellValue={this.setCellValue} visible={false} />
        </DataGrid>
      </div>
    );
  }
  customizeItem = (item) => {
    if (item && item.itemType === "group" && item.caption === "Home Address") {
      let gridInstance = this.dataGrid.current.instance;
      let index = gridInstance.getRowIndexByKey(this.rowKey);
      index = index === -1 ? 0 : index ;
      let isVisible = gridInstance.cellValue(index, "AddressRequired");
      item.visible = isVisible;
    }
  }
  onEditorPreparing = (e) => {
    if (e.dataField === "LastName" && e.parentType === "dataRow") {
      e.editorOptions.disabled = e.row.data && e.row.data.FirstName === "";
    }
  }
  onEditingStart = (e) => {
    this.rowKey = e.key;
  }
  onInitNewRow = (e) => {
    this.rowKey = -1;
    e.data.AddressRequired = false;
    e.data.FirstName = "";
  }
  setCellValue(newData, value) {
    let column = this;
    column.defaultSetCellValue(newData, value)
  }
}

export default App;
