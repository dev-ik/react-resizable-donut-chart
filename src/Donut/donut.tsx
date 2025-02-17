import React, { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './index.module.scss';
import { DonutInterface, PieDataType, PieDataItemType } from './types';
import { MOVE_DIRECTION } from './const';
import { redistribute, roundAndAdjust } from './helpers';

export const DonutResizableChart: FC<DonutInterface> = ({
  pieData: initialPieData,
  changePieData,
  sizes: { height, width, thickness } = {
    height: 245,
    width: 245,
    thickness: 30,
  },
  cornerRadius = null,
  isNotResizable = false,
  strokeWidth = 12,
  strokeColor = '#fff',
}) => {
  const rootRef = useRef(null);

  const preparePieData = (
    Array.isArray(initialPieData) ? initialPieData : []
  ).filter(({ value }) => typeof value === 'number' && value >= 0);

  const delta = 2;
  const countValue = preparePieData.length || 0;
  const minVal = 10;
  const maxVal = 100 + minVal * (1 - countValue);

  const selectedPiedataRef = useRef([...preparePieData]);
  const resizingDonutRef = useRef(false);
  const initCoordsRef = useRef({ x: 0, y: 0 });
  const selectedIdxRef = useRef<number | null>(null);
  const svgElementRef = useRef<d3.Selection<
    SVGSVGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const isTouchingRef = useRef(false);

  const bakeDonut = (pieData: PieDataType) => {
    const el = d3.select(rootRef.current);

    const svgWidth = width;
    const svgHeight = height;
    const svgThickness =
      isFinite(thickness) && thickness >= 14 ? thickness : 14;
    const radius = Math.min(svgWidth, svgHeight) / 2;
    const svgStrokeWidth = strokeWidth;
    const svgStrokeColor = strokeColor;

    const arc = d3
      .arc()
      .innerRadius(radius - svgThickness)
      .outerRadius(radius)
      .cornerRadius(cornerRadius !== null ? cornerRadius : radius);

    const arcHover = d3
      .arc()
      .innerRadius(radius - (svgThickness + 5))
      .outerRadius(radius + 8)
      .cornerRadius(cornerRadius !== null ? cornerRadius : radius);

    const getSVGElement = () => {
      if (!svgElementRef.current) {
        svgElementRef.current = el.append('svg');
      }

      return svgElementRef.current;
    };

    const svg = getSVGElement()
      .attr(
        'viewBox',
        `0 0 ${svgWidth + svgThickness} ${svgHeight + svgThickness}`,
      )
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    // Костыль. При таче нельзя удалять тронутый элемент иначе обработчик перестает работать.
    if (!isTouchingRef.current) {
      svg.selectAll('*').remove();
    }

    const g = svg
      .append('g')
      .attr(
        'transform',
        `translate( ${svgWidth / 2 + svgThickness / 2}, ${
          svgHeight / 2 + svgThickness / 2
        })`,
      );

    const pie = d3
      .pie<PieDataItemType>()
      .value(function (data) {
        return data.value;
      })
      .sort(null);

    const startHandler = ({
      clientX,
      clientY,
      element,
    }: {
      clientX: number;
      clientY: number;
      element: d3.PieArcDatum<PieDataItemType>;
    }) => {
      initCoordsRef.current.x = clientX;
      initCoordsRef.current.y = clientY;

      selectedIdxRef.current = element.index;
    };

    g.selectAll('path')
      .data(pie(pieData))
      .enter()
      .append('g')
      .append('path')
      .attr(
        'class',
        resizingDonutRef.current && !isNotResizable
          ? styles.dataPathResizing
          : styles.dataPath,
      )
      .each(function (element) {
        if (element.data.resizing) {
          d3.select<SVGPathElement, d3.DefaultArcObject>(this)
            .attr('d', arcHover)
            .attr('class', isNotResizable ? '' : styles.dataPathResizing);
        } else if (element.data.selected) {
          d3.select<SVGPathElement, d3.DefaultArcObject>(this)
            .attr('d', arcHover)
            .attr(
              'class',
              isNotResizable
                ? ''
                : selectedPiedataRef.current?.length > 1
                  ? styles.dataPathSelected
                  : '',
            );
        } else {
          d3.select<SVGPathElement, d3.DefaultArcObject>(this).attr('d', arc);
        }
      })
      .style('stroke', svgStrokeColor)
      .style('stroke-width', svgStrokeWidth)
      .attr('fill', (fillData) => fillData.data.color)
      .on('mousedown', function (event: MouseEvent, element) {
        event.preventDefault();
        event.stopPropagation();

        selectedPiedataRef.current = selectedPiedataRef.current.map((one) => ({
          ...one,
          selected: false,
        }));

        selectedPiedataRef.current[element.index].selected = true;
        g.selectAll<SVGPathElement, d3.DefaultArcObject>('path').attr('d', arc);
        d3.select<SVGPathElement, d3.DefaultArcObject>(this)
          .attr('d', arcHover)
          .attr('class', isNotResizable ? '' : styles.dataPathSelected);

        if (!isNotResizable) {
          startHandler({
            element,
            clientX: event.clientX,
            clientY: event.clientY,
          });
        }

        changePieData({
          data: selectedPiedataRef.current,
          selectedId: element.index,
        });
      })
      .on('touchstart', function (event: TouchEvent, element) {
        event.preventDefault();
        event.stopImmediatePropagation();
        isTouchingRef.current = true;

        selectedPiedataRef.current = selectedPiedataRef.current.map((one) => ({
          ...one,
          selected: false,
        }));

        selectedPiedataRef.current[element.index].selected = true;
        g.selectAll<SVGPathElement, d3.DefaultArcObject>('path').attr('d', arc);
        d3.select<SVGPathElement, d3.DefaultArcObject>(this)
          .attr('d', arcHover)
          .attr('class', isNotResizable ? '' : styles.dataPathSelected);

        if (!isNotResizable) {
          startHandler({
            element,
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
          });
        }
      })
      .on('mouseover', function () {
        if (selectedIdxRef.current === null) {
          selectedPiedataRef.current = selectedPiedataRef.current.map(
            (one) => ({
              ...one,
            }),
          );

          d3.select<SVGPathElement, d3.DefaultArcObject>(this).attr(
            'd',
            arcHover,
          );
        }
      })
      .on('mouseout', function (event, element) {
        event.preventDefault();
        event.stopPropagation();

        if (!element.data.selected) {
          d3.select<SVGPathElement, d3.DefaultArcObject>(this).attr('d', arc);
        }
      });
  };

  useEffect(() => {
    selectedPiedataRef.current = initialPieData;

    const moveUp = ({
      pieData,
      selectedIdx,
    }: {
      pieData: PieDataType;
      selectedIdx: number;
    }) => {
      if (pieData[selectedIdx]?.value + delta <= maxVal) {
        const newDistribution = redistribute(
          pieData.map((one) => one.value),
          selectedIdx,
          delta,
        );

        return pieData.map((one, index) => ({
          ...one,
          value: newDistribution[index],
        }));
      }

      return pieData;
    };

    const moveDown = ({
      pieData,
      selectedIdx,
    }: {
      pieData: PieDataType;
      selectedIdx: number;
    }) => {
      if (pieData[selectedIdx]?.value - delta >= minVal) {
        const newDistribution = redistribute(
          pieData.map((one) => one.value),
          selectedIdx,
          -delta,
        );

        return pieData.map((one, index) => ({
          ...one,
          value: newDistribution[index],
        }));
      }

      return pieData;
    };

    const handlerMove = ({
      clientY,
      event,
    }: {
      clientY: number;
      event: MouseEvent | TouchEvent;
    }) => {
      if (
        selectedIdxRef.current !== null &&
        selectedPiedataRef.current?.length > 1
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const diffY = initCoordsRef.current.y - clientY;

        const stepUpdate = 3;

        let moveDirection;

        if (diffY > stepUpdate) {
          initCoordsRef.current.y = clientY;
          moveDirection = MOVE_DIRECTION.up;
        } else if (diffY < -stepUpdate) {
          initCoordsRef.current.y = clientY;
          moveDirection = MOVE_DIRECTION.down;
        }

        if (moveDirection) {
          if (moveDirection === MOVE_DIRECTION.up) {
            selectedPiedataRef.current = moveUp({
              pieData: selectedPiedataRef.current,
              selectedIdx: selectedIdxRef.current,
            });
          } else if (moveDirection === MOVE_DIRECTION.down) {
            selectedPiedataRef.current = moveDown({
              pieData: selectedPiedataRef.current,
              selectedIdx: selectedIdxRef.current,
            });
          }

          selectedPiedataRef.current[selectedIdxRef.current].resizing = true;
          resizingDonutRef.current = true;

          bakeDonut(selectedPiedataRef.current);

          const adjusted = roundAndAdjust(
            selectedPiedataRef.current.map((one) => one.value),
            selectedIdxRef.current,
          );

          changePieData({
            data: selectedPiedataRef.current,
            isDonutResize: true,
            selectedId: selectedIdxRef.current,
            resizingValue: adjusted[selectedIdxRef.current],
            moveDirection,
          });
        }
      }
    };

    const handlerMouseMove = (event: MouseEvent) => {
      handlerMove({
        clientY: event.clientY,
        event,
      });
    };

    const handlerTouchMove = (event: TouchEvent) => {
      handlerMove({
        clientY: event.changedTouches[0].clientY,
        event,
      });
    };

    const handlerMouseUp = () => {
      if (selectedIdxRef.current !== null) {
        // Округление дробных значений
        const adjusted = roundAndAdjust(
          selectedPiedataRef.current.map((one) => one.value),
          selectedIdxRef.current,
        );

        selectedPiedataRef.current = selectedPiedataRef.current.map(
          (one, index) => ({
            ...one,
            value: adjusted[index],
          }),
        );

        isTouchingRef.current = false;
        selectedPiedataRef.current[selectedIdxRef.current].resizing = false;
        const selectedId = selectedIdxRef.current;

        resizingDonutRef.current = false;

        bakeDonut(selectedPiedataRef.current);
        selectedIdxRef.current = null;
        changePieData({
          data: selectedPiedataRef.current,
          selectedId,
          isDonutResize: false,
          resizingValue: adjusted[selectedId],
          moveDirection: undefined,
        });
      }
    };

    window.addEventListener('mousemove', handlerMouseMove);
    window.addEventListener('touchmove', handlerTouchMove, { passive: false });
    window.addEventListener('mouseup', handlerMouseUp);
    window.addEventListener('touchend', handlerMouseUp);

    bakeDonut(initialPieData);

    return () => {
      window.removeEventListener('mousemove', handlerMouseMove);
      window.removeEventListener('touchmove', handlerTouchMove);
      window.removeEventListener('mouseup', handlerMouseUp);
      window.removeEventListener('touchend', handlerMouseUp);
    };
  }, [initialPieData]);

  return <div className={styles.root} ref={rootRef} />;
};
