export interface RawViewData {
    id: number;
    offer_id: number;
    viewcount: number;
    created: string;
}

export interface ViewChartData {
    yScaleMin: number;
    yScaleMax: number;
    collection: ChartDataSet[];
}

export interface ChartDataSet {
    name: string;
    series: ChartNode[];
}

export interface ChartNode {
    name: Date;
    value: number;
}
