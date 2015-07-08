Draggable rows plugin for ui-grid
=================================

Play with HTML5 _drag and drop_ in angular ui-grid.

![Preview](http://i.imgur.com/1Zmi1B6.gif)

> View demo in codepen http://codepen.io/anon/pen/wayNOv

## Install
Install through bower

```sh
bower install ui-grid-draggable-rows
```

Add plugin as dependency to your module

```js
angular.module("app", ["ui.grid", "ui.grid.draggable-rows"]);
```

## Usage
To add _drag and drop_ functionality you have to insert `ui-grid-draggable-rows` directive to your table.

```html
<div ui-grid="gridOptions" class="grid" ui-grid-draggable-rows></div>
```

Now, you have to add draggable wrapper to your `rowTemplate`. If you have your own template just replace the inner div.

```html
$scope.gridOptions = {
    rowTemplate: '<div grid="grid" class="ui-grid-draggable-row" draggable="true"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'custom\': true }" ui-grid-cell></div></div>'
};
```


To add action after dropping row register new listener on `rowDropped` event.

```js
$scope.gridOptions.onRegisterApi = function (gridApi) {
    gridApi.draggableRows.on.rowDropped($scope, function (info, dropTarget) {
        console.log("Dropped", info);
    });
};
```

## Additional styling
When you drag a row over others they get additional css class `ui-grid-draggable-row-over`. This plugin has default styling for these elements. If you are using __less__ you could import styles into your application.

```css
@import "/path/to/bower_components/ui-grid-draggable-rows/less/draggable-rows";
```

If you are using clear css just put these styles into your stylesheet.

```css
.ui-grid-draggable-row {
    height: 30px;
}

.ui-grid-draggable-row-over {
    position: relative;
    color: #AAA;
}

.ui-grid-draggable-row-over:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    border-bottom: 1px dashed #AAA;
}

.ui-grid-draggable-row-over--above:before {
    top: 0;
}

.ui-grid-draggable-row-over--below:before {
    bottom: 0;
}
```

## List of events

| Event         | Listener                               | Original event   | Description                                 |
|---------------|----------------------------------------|------------------|---------------------------------------------|
| rowDragged    | function(info, rowElement)             | onDragStart      | Fired once during start dragging            |
| rowEnterRow   | function(info, rowElement)             | onDragEnter      | Fired when draggable row enter on other row |
| rowOverRow    | function(info, rowElement)             | onDragOver       | Fired when draggable row is over other row  |
| rowLeavesRow  | function(info, rowElement)             | onDragLeave      | Fired when draggable row leaves other row   |
| rowFinishDrag | function()                             | onDragEnd        | Fired after finish dragging                 |
| rowDropped    | function(info, targetElement)          | onDrop           | Fired when row is dropping to other row     |

To listen these events just register new listener via _ui-grid_ API.

`info` is an object with the following properties
```js
{
    draggedRow: domElement,     // The dragged row element

    draggedRowEntity: object,   // The object the row represents in the grid data (`row.entity`)

    position: string,           // String that indicates whether the row was dropped
                                // above or below the drop target (determined by half row height)
                                // eg. 'above' or 'below'

    fromIndex: int,             // Original position of dragged row in sequence

    toIndex: int,               // New position of dragged row in the sequence
}
```

```js
$scope.gridData.onRegisterApi = function (gridApi) {
    gridApi.draggableRows.on.rowDragged($scope, function (info, rowElement) {
        console.log("Start dragging...");

        // do something
    });
};
```

## Todo
- [ ] automatically insert the required template row
- [ ] write test _(better late than never)_
- [ ] improve documentation

## Author
Plugin **ui-grid-draggable-rows** has been orginally developed by [Szymon Krajewski](https://github.com/skrajewski).

## License
The MIT License &copy; 2015
