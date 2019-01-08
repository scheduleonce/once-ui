The `oui-table` provides data table that can be used to display rows of data.

### **Getting Started**

1. **Write your oui-table and provide data**

Begin by adding the <table oui-table> component and passing the data.

The simplest way to provide data to the table is by passing a data array to the table's `dataSource` input. The table will take the array and render a row for each object in the data array.

```html
<table oui-table [dataSource]="myDataArray">
  ...
</table>
```

Since, the table optimizes for performance, it will not automatically check for changes to the data array. Instead, when objects are added, removed, or moved on the data array, you can trigger an update to the table's rendered rows by calling its `renderRows()` method.

While an array is the simplest way to bind data into the data source, it is also the most limited. For more complex applications, using a `DataSource` instance is recommended. See the section "Advanced data sources" below for more information.

2. **Define the column templates**

Next, write for your table columns templates.

Each column definition should be given a unique name and contain the content for its header and row cells.

Here's a simple column definition with the name `'userName'`. The header cell contains the text "Name" and each row cell will render the name property of each row's data.

```html
<ng-container ouiColumnDef="userName">
  <th oui-header-cell *ouiHeaderCellDef>Name</th>
  <td oui-cell *ouiCellDef="let user">{{user.name}}</td>
</ng-container>
```

3. **Define the row templates**

Finally, once you have defined your columns, you need to tell the table which columns will be rendered in the header and data rows.
To start, create a variable in your component that contains the list of the columns you want to render.
