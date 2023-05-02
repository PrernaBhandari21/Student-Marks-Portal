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
    this.createPercentageChart();
    this.createTotalQsDonutChart();
    this.createRightCountDonutChart();
    this.createPeerAvgDonutChart();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getStudentData() {
    this.data = this.dataService.getClickedRow();
    console.log("FINALLY THE STUDENT DATA IS : ", this.data);    
  }

  createPercentageChart() {
    this.chartOptions = {
      chart: {
        type: this.chartType,
        height: 300,
        stacked: false,
        toolbar: {
          show: false
        },
        width:500
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
          barWidth: "40%", // Adjust the width of the bars as needed
          distributed: true
        }
      },
    };

    const chart = new ApexCharts(document.querySelector("#percentageChart"), this.chartOptions);
    chart.render();
  }

  createTotalQsDonutChart() {
    const subjectData = Object.entries(this.data.resultData)
      .filter(([key, value]) => key.includes('Subject') && key.includes('Total Questions'));
  
    const totalQuestions = subjectData.map(([key, value]) => Number(value));
  
    this.chartOptions = {
      chart: {
        type: 'donut',
        height: 300,
        toolbar: {
          show: false
        },
        width: 500
      },
      labels: subjectData.map(([key]) => key.replace('Subject', '').replace('Total Questions', '').trim()),
      series: totalQuestions,
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          },
        }
      },
      legend: {
        show: true,
        position: 'right',
        offsetY: 0,
        formatter: function (seriesName: string, opts: { w: { globals: { series: { [x: string]: string; }; }; }; seriesIndex: string | number; }) {
          return opts.w.globals.series[opts.seriesIndex] + ': ' + seriesName;
        },
        markers: {
          fillColors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
        },
        itemMargin: {
          horizontal: 5,
          vertical: 5
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  
    const chart = new ApexCharts(document.querySelector("#totalQsdonutChart"), this.chartOptions);
    chart.render();
  }
  
  
  
  createRightCountDonutChart() {
    const subjectData = Object.entries(this.data.resultData)
      .filter(([key, value]) => key.includes('Subject') && key.includes('Right Count'));
  


    const labels = subjectData.map(([key]) => key.replace('Subject', '').replace('Right Count', '').trim());
    const rightCounts = subjectData.map(([key, value]) => Number(value));

    console.log("subjectData : ", subjectData);
    console.log("labels : ", labels);
    console.log("rightCounts : ",rightCounts);
  
    this.chartOptions = {
      chart: {
        type: 'donut',
        height: 300,
        toolbar: {
          show: false
        },
        width: 500
      },
      labels: labels,
      series: rightCounts,
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          },
        }
      },
      legend: {
        show: true,
        position: 'right',
        offsetY: 0,
        formatter: function (seriesName: any, opts: { seriesIndex: any; }) {
          const index = opts.seriesIndex;
          return labels[index] + ' Right Count: ' + rightCounts[index];
        },
        markers: {
          fillColors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
        },
        itemMargin: {
          horizontal: 5,
          vertical: 5
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  
    const chart = new ApexCharts(document.querySelector("#rightCountDonutChart"), this.chartOptions);
    chart.render();
  }
  

  createPeerAvgDonutChart() {
    const labels = Object.keys(this.data.peerAverageRightCount);
    const rightCounts = Object.values(this.data.peerAverageRightCount);
  
    console.log("labels: ", labels);
    console.log("rightCounts: ", rightCounts);
  
    this.chartOptions = {
      chart: {
        type: 'donut',
        height: 300,
        toolbar: {
          show: false
        },
        width: 500
      },
      labels: labels,
      series: rightCounts,
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          },
        }
      },
      legend: {
        show: true,
        position: 'right',
        offsetY: 0,
        formatter: function (seriesName: any, opts: { seriesIndex: any; }) {
          const index = opts.seriesIndex;
          return labels[index] + ' Right Count: ' + rightCounts[index];
        },
        markers: {
          fillColors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
        },
        itemMargin: {
          horizontal: 5,
          vertical: 5
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  
    const chart = new ApexCharts(document.querySelector("#peerAvgDonutChart"), this.chartOptions);
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
