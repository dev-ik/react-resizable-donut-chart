# React resizable donut chart

### [Demo](https://react-donut-chart-resizeble.dev-ik.ru/)

![Example](https://raw.githubusercontent.com/dev-ik/react-resizable-donut-chart/main/example.gif)

## Installation

`npm install react-resizable-donut-chart --save`

---

## Usage

```js
import { DonutResizableChart } from 'react-resizable-donut-chart';

export const ResizableDonut = () => {
  const [pieData, setPieData] = useState({
    data: [
      {
        value: 40,
        color: '#18FFFF',
        selected: true,
        resizing: false,
      },
      {
        value: 26,
        color: '#0288D1',
        selected: false,
        resizing: false,
      },
      {
        value: 10,
        color: '#BF360C',
        selected: false,
        resizing: false,
      },
      {
        value: 13,
        color: '#F4511E',
        selected: false,
        resizing: false,
      },
      {
        value: 11,
        color: '#F9A825',
        selected: false,
        resizing: false,
      },
    ],
    selectedId: 0,
  });

  return <DonutResizableChart pieData={pieData.data} changePieData={setPieData} />;
}
```

---

## Props

| Name           | Required | Default                                                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|----------------|----------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data           | true     | `[]`                                                                      | To display the diagram, the necessary data is an array of objects, each object must contain 2 parameters "color" and "value". To specify which part of the diagram will be highlighted by default, you must specify "selected: true". Example: <br/>```[{color: 'red', value: 50, selected: true},{color:'black, value: 50, selected: false}]```                                                                                                                                                                                                                               |
| changePieData  | true     | `({data, selectedId, isDonutResize, resizingValue, moveDirection}) => {}` | data - returns a data object with the changed `value`, "selected: true" or "selected: false", as well as whether this object changes at a given moment or not `resizing: true` or `resizing: false` <br/> selectedId - returns the `id` of the currently selected object in the array `data`<br/> isDonutResize - returns `true` or `false` depending on whether<br/> resizingValue is currently underway or not - returns the current modified `value` of the selected<br/> moveDirection object - returns the `up` or `down` direction if a recycle occurs, otherwise `null` |
| cornerRadius   | false    | `null`                                                                    | Specify the radius of the chart line                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 
| isNotResizable | false    | `false`                                                                   | Is it possible to change the values of individual parts of the graph                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| strokeWidth    | false    | `12`                                                                      | stroke-width for chart parts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| strokeColor    | false    | `#fff`                                                                    | stroke-color for chart parts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
                                     
