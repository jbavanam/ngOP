import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "circularProgressBar",
    template: `
    <GridLayout [height]="height" [width]="height">
        <RadRadialGauge>
            <RadialScale tkRadialGaugeScales startAngle="-90" sweepAngle="360">
                <ScaleStyle tkRadialScaleStyle ticksVisible="false" labelsVisible="false" lineThickness="0">
                </ScaleStyle>

                <RadialBarIndicator tkRadialScaleIndicators minimum="0" maximum="100">
                    <BarIndicatorStyle tkRadialBarIndicatorStyle [fillColor]="fillBackgroundColor" cap="Round" barWidth="0.2">
                    </BarIndicatorStyle>
                </RadialBarIndicator>

                <RadialBarIndicator tkRadialScaleIndicators minimum="0" [maximum]="value" isAnimated="true">
                    <BarIndicatorStyle tkRadialBarIndicatorStyle [fillColor]="timeColor" cap="Round" barWidth="0.2">
                    </BarIndicatorStyle>
                </RadialBarIndicator>
            </RadialScale>
        </RadRadialGauge>
        <Label [text]="text" [color]="timeColor" [fontSize]="textSize" class="m-x-auto m-y-auto" [marginTop]="offset"></Label>
    </GridLayout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircularProgressBarComponent {
    @Input() size = 100;
    @Input() progress = 0;
    @Input() textColor = "#bfbfc4";
    @Input() fillColor = "#FDA458";
    @Input() fillBackgroundColor = "#efeff4";
    @Input() offset = 0;
    @Input() dispvalue = 0;

    successColor = "#64a338";
    warningColor = "#FDA458";
    dangerColor = "#e03b24";

    get height() {
        return Math.min(this.size, 250);
    };
    get value() {
        return Math.min(this.progress, 100);
    };
    get text() {
        return this.dispvalue;
    };
    get textSize() {
        return this.height / 2;
    };

    get timeColor() {
        if(this.progress > 50)
        {
            return this.successColor;
        } else if(this.progress > 25)
        {
            return this.warningColor;
        } else
            return this.dangerColor;
    }
}