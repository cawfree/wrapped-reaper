import * as React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryClipContainer,
} from 'victory';
import {FormattedNumber} from 'react-intl';
import millify from 'millify';

import {Stateful, WrappedReaperState, StatefulResult} from '../@types';
import {isStatefulResult, stripDecimalComponent} from '../utils';

const costBasis = (value: number, basisPoints: number) =>
  (value * basisPoints) / 10000;

const calculateScythe = ({
  maxSupply,
  bladeWidth,
  stake,
  maxTaxBasisPoints,
  minTaxBasisPoints,
  bladeDiscountBasisPoints,
  currentSupply,
}: {
  readonly maxSupply: number;
  readonly bladeWidth: number;
  readonly stake: number;
  readonly maxTaxBasisPoints: number;
  readonly minTaxBasisPoints: number;
  readonly bladeDiscountBasisPoints: number;
  readonly currentSupply: number;
}) => {
  const handleWidth = maxSupply - bladeWidth;
  const maxTax = costBasis(stake, maxTaxBasisPoints);
  const minTax = costBasis(stake, minTaxBasisPoints);
  const bladeDiscount = costBasis(stake, bladeDiscountBasisPoints);

  const linearTax = handleWidth > 0
    ? (((maxTax - minTax) * currentSupply) / handleWidth) + minTax
    : maxTax;

  const linearPrice = stake + (linearTax < maxTax ? linearTax : maxTax);

  if (currentSupply > handleWidth)
    return linearPrice - ((((currentSupply - handleWidth) * Math.sqrt(bladeDiscount)) / bladeWidth) ** 2);

  return linearPrice;
};

const computeScytheGraphData = (wrappedReaperResult: StatefulResult<WrappedReaperState>) => {
  const {result} = wrappedReaperResult;

  const {
    maxSupply: defaultMaxSupply,
    bladeDiscountBasisPoints,
    minTaxBasisPoints,
    maxTaxBasisPoints,
    bladeWidth,
  } = result;

  const maxSupply = Number(String(defaultMaxSupply));
  const stake = 1_000_000;

  return [...Array(maxSupply)].map(
    (_, currentSupply: number) => {
      const scythe = calculateScythe({
        maxSupply: Number(String(maxSupply)),
        bladeWidth: Number(String(bladeWidth)),
        // TODO: scale
        stake,
        maxTaxBasisPoints: Number(String(maxTaxBasisPoints)),
        minTaxBasisPoints: Number(String(minTaxBasisPoints)),
        bladeDiscountBasisPoints: Number(String(bladeDiscountBasisPoints)),
        currentSupply,
      });

      // Convert into an equivalent percentage.
      return {x: currentSupply, y: ((scythe - stake) / stake) * 100};
    },
  );
};

const axisLabel: React.CSSProperties = {
  fontFamily: 'Roboto Mono',
  fontWeight: 'bold',
  fontSize: 10,
  textTransform: 'uppercase',
};

const tickLabels: React.CSSProperties = {
  fontFamily: 'Roboto Mono',
  fontSize: 10,
  fontWeight: 'bold',
};

export const WrappedReaperScythe = React.memo(
  function WrappedReaperScythe({
    wrappedReaperResult,
  }: {
    readonly wrappedReaperResult: Stateful<WrappedReaperState>;
  }): JSX.Element {

    const data = React.useMemo(() => {
      if (!isStatefulResult(wrappedReaperResult)) return [];

      return computeScytheGraphData(wrappedReaperResult);
    }, [wrappedReaperResult]);

    const maybeMaxSupply = isStatefulResult(wrappedReaperResult) && Number(String(wrappedReaperResult.result.maxSupply));
    const maybeCurrentPosition = isStatefulResult(wrappedReaperResult)
      && typeof maybeMaxSupply === 'number'
      && Math.min(
          Number(String(wrappedReaperResult.result.totalSupply)),
          maybeMaxSupply - 1
        );
    const maybeCurrentTribute = typeof maybeCurrentPosition === 'number' && data[maybeCurrentPosition]?.y;

    return (
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="font-mono uppercase text-center text-xl">Circulating Supply</div>
            <div className="text-3xl lg:text-5xl font-bold mt-2">
              {isStatefulResult(wrappedReaperResult)
                ? String(wrappedReaperResult.result.totalSupply)
                : "-"}
              /
              {isStatefulResult(wrappedReaperResult)
                ? String(wrappedReaperResult.result.maxSupply)
                : "-"}
            </div>
          </div>
          <div className="card">
            <div className="font-mono uppercase text-center text-xl">Current Tribute</div>
            <div className="text-3xl lg:text-5xl font-bold mt-2" style={{color: isStatefulResult(wrappedReaperResult) ? '#6701E6' : 'black'}}>
              {isStatefulResult(wrappedReaperResult) && typeof maybeCurrentTribute === 'number'
                ? <FormattedNumber value={maybeCurrentTribute / 100} style="percent"  maximumFractionDigits={2} />
                : "-"}
            </div>
          </div>
          <div className="card">
            <div className="font-mono uppercase text-center text-xl">Total $RG Burned</div>
            <div className="text-3xl lg:text-5xl font-bold mt-2">
              {isStatefulResult(wrappedReaperResult)
                ? millify(Number(String(stripDecimalComponent(wrappedReaperResult.result.totalBurned, wrappedReaperResult.result.decimals))))
                : "-"}
            </div>
          </div>
          <div className="card">
            <div className="font-mono uppercase text-center text-xl">Current $RG Wrapped</div>
            <div className="text-3xl lg:text-5xl font-bold mt-2">
              {isStatefulResult(wrappedReaperResult)
                ? millify(Number(String(stripDecimalComponent(wrappedReaperResult.result.totalWrapped, wrappedReaperResult.result.decimals))))
                : "-"}
            </div>
          </div>
        </div>
        <div className="card">
          <VictoryChart padding={{left: 50, top: 10, bottom: 20, right: 40}} height={170}>
            <VictoryAxis style={{axisLabel, tickLabels}} />
            <VictoryAxis
              dependentAxis
              style={{axisLabel: {...axisLabel}, tickLabels: {...tickLabels}}}
              tickFormat={(x) => `${x}%`}
            />
            <VictoryLine
              groupComponent={<VictoryClipContainer clipPadding={{ top: 10, bottom: 0, right: 10 }} />}
              style={{
                data: {strokeWidth: 4, strokeLinecap: 'round'},
              }}
              data={data}
            />
            {typeof maybeCurrentTribute === 'number' && false && (
              <VictoryScatter
                style={{data: {fill: 'black'}}}
                size={3}
                data={data.filter((_, i) => {
                  const d = typeof maybeCurrentPosition === 'number'
                    ? Math.abs(i - maybeCurrentPosition)
                    : 0;
                  const even = typeof maybeCurrentPosition === 'number' && maybeCurrentPosition % 2 === 0;
                  return i % 2 == (even ? 0 : 1) && d > 1;
                })}
              />
            )}
            {typeof maybeCurrentTribute === 'number' && (
              <VictoryScatter
                style={{data: {fill: '#6701E6'}}}
                size={5}
                data={[{
                  x: maybeCurrentPosition,
                  y: maybeCurrentTribute,
                }]}
              />
            )}
          </VictoryChart>
        </div>
      </div>
    );
  }
);
