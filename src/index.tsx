import React, { useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChangePieDataType, DonutResizableChart } from './Donut';
import styles from './index.module.scss';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

const App = () => {
  const [pieData, setPieData] = useState<ChangePieDataType>({
    data: [
      {
        value: 40,
        color: '#183342',
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

  const selectHandler = (index: number) => () => {
    setPieData({
      data: pieData.data.map((i, idx) => {
        return {
          ...i,
          selected: idx === index,
        };
      }),
      selectedId: index,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.donut}>
        <div className={styles.donut_wrapper}>
          <DonutResizableChart
            pieData={pieData.data}
            changePieData={setPieData}
          />
          <div className={styles.inner}>
            <div className={styles.inner_headline}>Color</div>
            <div
              className={styles.inner_content}
              style={{
                backgroundColor: pieData.data[pieData.selectedId].color,
              }}
            >
              {pieData.data[pieData.selectedId].value.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      <div className={styles.legend}>
        {pieData.data.map((item, index) => {
          const className = item.selected
            ? styles.legend_item_selected
            : styles.legend_item;
          return (
            <div
              key={index}
              className={className}
              onClick={selectHandler(index)}
            >
              <div className={styles.legend_item_headline}>
                <span>Color:</span>
                <div
                  className={styles.color}
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div className={styles.legend_item_headline}>
                <span>Value:</span> {item.value.toFixed(2)}
              </div>
              <div className={styles.legend_item_headline}>
                <span>Selected:</span> {item.selected.toString()}
              </div>
              <div className={styles.legend_item_headline}>
                <span>Resizing:</span> {item.resizing.toString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
