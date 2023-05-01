import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-student-personal-report',
  templateUrl: './student-personal-report.component.html',
  styleUrls: ['./student-personal-report.component.css']
})

export class StudentPersonalReportComponent implements OnInit {

  data: any;
  chartOptions: any;
  chartData: any;
  chartType: string = 'bar';

  constructor(
    private dataService: DataService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.getStudentData();
    this.createChart();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getStudentData() {
    this.data = this.dataService.getClickedRow();
    console.log("FINALLY THE STUDENT DATA IS : ", this.data);    
  }

  createChart() {
    this.chartOptions = {
      chart: {
        type: this.chartType,
        height: 350,
        stacked: false,
        toolbar: {
          show: false
        },
        width:550
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#075CFA", "#F92204", "#F9A704", "#1EB317"], // Update the colors array
      series: [
        {
          name: 'Percentage',
          data: [this.data?.resultData["Percentage"], this.data?.percentagesValue.lowestPercentage, this.data?.percentagesValue.averagePercentage, this.data?.percentagesValue.highestPercentage]
          // data: [10, 30.35, 30, 10]

        }
      ],
      xaxis: {
        categories: ['Your Score', 'Lowest Score', 'Average Score', 'Highest Score'],
      },
      yaxis: {
        title: {
          text: '%'
        },
        labels: {
          formatter: function (value: any) {
            return value + "%";
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          barWidth: "60%", // Adjust the width of the bars as needed
          distributed: true
        }
      },
    };

    const chart = new ApexCharts(document.querySelector("#percentageChart"), this.chartOptions);
    chart.render();
  }

  // Download whole page !
  downloadPage() {
    const doc = new jsPDF();
    const elementToCapture = this.elementRef.nativeElement.querySelector('.component-to-download');
    html2canvas(elementToCapture, { useCORS: true }).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 4;
      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xPos = margin;
      const yPos = margin;
      doc.addImage(imageData, 'PNG', xPos, yPos, imgWidth, imgHeight);
      doc.save('component.pdf');
    });
  }
}
