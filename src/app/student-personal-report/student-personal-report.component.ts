import {  AfterViewInit, Component, ElementRef,  OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DataService } from '../services/data.service';
import html2canvas from 'html2canvas';
import * as ApexCharts from 'apexcharts';
import { jsPDF } from 'jspdf';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-student-personal-report',
  templateUrl: './student-personal-report.component.html',
  styleUrls: ['./student-personal-report.component.css']
})

export class StudentPersonalReportComponent implements OnInit, AfterViewInit   {

  @ViewChildren('chartContainer') chartContainers!: QueryList<ElementRef>;
  @ViewChildren('peerChartContainer') peerChartContainers!: QueryList<ElementRef>;
  @ViewChildren('subBarchartContainer') subBarchartContainers!: QueryList<ElementRef>;


  dataSource!: MatTableDataSource<any>;
  // displayedColumns: string[] = ['Rank', 'RollNo','Name', 'Percentage', 'TotalMarks'];
  dynamicColumns: string[] = [];




  data: any;
  chartOptions: any;
  chartData: any;
  chartType: string = 'bar';
  totalNoOfQues: any;
  questionLogic: string[] = [];

  quesWiseTableData : any ={};
  quesdataSource!: MatTableDataSource<any>;
  quesdisplayedColumns: string[] = [
  'sNo',
  'subject',
  'answerMarked',
  'answerKey',
  // 'totalRightPercentage',
  // 'totalWrongPercentage',
  // 'totalBlankPercentage',
];

 

  

  constructor(
    private dataService: DataService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }
 

  

  ngOnInit(): void {
    this.getStudentData();

    this.totalNoOfQues = this.data.answer_key.length;
    // this.createPercentageChart();
    // this.createTotalQsDonutChart();
    // this.createRightCountDonutChart();
    // this.createPeerAvgDonutChart();
    this.analyzeQues();

    //top candidates
    this.dataSource = new MatTableDataSource(this.data.toppersList);
    // this.generateDynamicColumns();

    // this.moveColumnsToEnd(['TotalMarks', 'Percentage']);

    this.quesWiseAnalysisData()

  }

  ngAfterViewInit() {
    const subjects = this.getSubjects(this.data?.resultData);
  
    this.chartContainers.forEach((container, index) => {
      const subject = subjects[index];
      this.generatePieChart(subject, container);
    });


    this.peerChartContainers.forEach((container, index) => {
      const subject = this.getSubjects(this.data?.resultData)[index];
      this.generatePeerPieChart(subject, container);
    });


    this.subBarchartContainers.forEach((container, index) => {
      const subject = subjects[index];
      this.generateBarChart(subject, container);
    });
  
    
  }
  
  // generateDynamicColumns() {
  //   this.data.toppersList.forEach((element:any) => {
  //     for (const key in element) {
  //       if (key.startsWith('Subject') && key.endsWith('Total Marks') && !this.dynamicColumns.includes(key)) {
  //         this.dynamicColumns.push(key);
  //         this.displayedColumns.push(key);
  //       }
  //     }
  //   });
  // }

  quesWiseAnalysisData(){
    
   this.quesWiseTableData ={
    ansMarked : this.data.omrResponse,
    peerComparison : this.data.questionWiseRWB,
    answerKey : this.data.answer_key
   }
  //  console.log("quesWiseTableData : ",this.quesWiseTableData );

   this.createTable();

  }

  createTable() {
    if (
      this.quesWiseTableData &&
      typeof this.quesWiseTableData === 'object'
    ) {

      console.log(" this.quesWiseTableData : ", this.quesWiseTableData);

      // Extract answer marked values
      const answerMarked =
        this.quesWiseTableData.ansMarked
          ? Object.values(this.quesWiseTableData.ansMarked)
          : [];
      // console.log(answerMarked);
  
      const answerKey =
        this.quesWiseTableData.answerKey
          ? this.quesWiseTableData.answerKey.map(
              (item: any) => item.AnswerKey
            )
          : [];

      // console.log(this.quesWiseTableData.peerComparison);
  
      // const totalRightPercentage = this.quesWiseTableData.peerComparison
      //   ? Object.keys(this.quesWiseTableData.peerComparison)
      //       .filter((key: string) => key.includes('Total Right'))
      //       .map((key: string) => this.quesWiseTableData.peerComparison[key])
      //   : [];
      // const totalWrongPercentage = this.quesWiseTableData.peerComparison
      //   ? Object.keys(this.quesWiseTableData.peerComparison)
      //       .filter((key: string) => key.includes('Total Wrong'))
      //       .map((key: string) => this.quesWiseTableData.peerComparison[key])
      //   : [];
      // const totalBlankPercentage = this.quesWiseTableData.peerComparison
      //   ? Object.keys(this.quesWiseTableData.peerComparison)
      //       .filter((key: string) => key.includes('Total Blank'))
      //       .map((key: string) => this.quesWiseTableData.peerComparison[key])
      //   : [];
      // console.log(totalRightPercentage);
  
      // Creating headers
      const headers = [
        'Subject',
        'Answer Marked',
        'Answer Key',
        // 'Total Right Percentage',
        // 'Total Wrong Percentage',
        // 'Total Blank Percentage',
      ];
  
      // Arranging the data
      const tableData = answerMarked.map((_, i) => ({
        subject:
          this.quesWiseTableData.answerKey &&
          this.quesWiseTableData.answerKey[i]
            ? this.quesWiseTableData.answerKey[i].Subject
            : '',
        answerMarked: answerMarked[i],
        answerKey: answerKey[i],
        // totalRightPercentage: totalRightPercentage[i],
        // totalWrongPercentage: totalWrongPercentage[i],
        // totalBlankPercentage: totalBlankPercentage[i],
      }));
  
  
    
      this.quesdataSource = new MatTableDataSource(tableData);

      console.log("this.quesdataSource : ",this.quesdataSource);
    
    } else {
      console.error('Invalid or missing data.');
    }
  }
  

  // moveColumnsToEnd(columns: string[]) {
  //   columns.forEach((column) => {
  //     const index = this.displayedColumns.indexOf(column);
  //     if (index > -1) {
  //       this.displayedColumns.splice(index, 1);
  //       this.displayedColumns.push(column);
  //     }
  //   });
  // }
 
  
  
  
  
  
  
  analyzeQues() {
    this.questionLogic = []; // Clear the array before analyzing questions
  
    for (let j = 0; j < this.data.answer_key.length; j++) {
      let question = "Ques " + (j + 1);
      let answer = this.data.omrResponse[question];
      let answerKey = this.data.answer_key[j].AnswerKey;
  
      if (answer === null) {
        console.log(answer);
        console.log("Blank");
        this.questionLogic.push('blank');
      } else if (answer === answerKey) {
        console.log("Correct");
        console.log("answer",answer);
        console.log("answerKey",answerKey);
        this.questionLogic.push('correct');
      } else {
        console.log("Wrong");
        this.questionLogic.push('wrong');
      }
    }
  
    console.log(this.questionLogic);
  }
  

  // analyzeQues() {
  //   this.questionLogic = []; // Clear the array before analyzing questions
  
  //   console.log("this.data.answer_key.length", this.data.answer_key.length);

  //   for (let j = 0; j < this.data.answer_key.length; j++) {
  //     let question = "Ques " + (j + 1);
  //     let answer = this.data.resultData[question];
  //     let full_marks = this.data.answer_key[j].FullMarks;
  //     let partial_marks = this.data.answer_key[j]["Partial Marks"];
  //     let negative_marks = this.data.answer_key[j]["Negative Marks"];
  //     let subject = this.data.answer_key[j].Subject;
  
  //     console.log(`answer ${j+1}`, answer );
  //     if (answer == full_marks) {
  //       console.log("full_marks", full_marks);
  //       this.questionLogic.push('correct');
  //     } else if (answer == negative_marks) {
  //       console.log("negative_marks : ",negative_marks);
  //       this.questionLogic.push('wrong');
  //     } else if (answer == 0 || null) {
  //       this.questionLogic.push('blank');
  //     }
  //   }

  //   console.log(this.questionLogic);
  // }
  
  

  getQuestionNumbers(): number[] {
    return Array(this.totalNoOfQues).fill(0).map((_, i) => i + 1);
  }
  

//   showQuestions(){
//     const totalQuestions = this.data.answer_key.length;
//     const questionsPerRow = 10;
//     console.log("totalQuestion: ",totalQuestions);
//     console.log("questionsPerRow : ",questionsPerRow);

//     const questionContainer = this.elementRef.nativeElement.querySelector('#questionContainer');
//     const numberOfRows = Math.ceil(totalQuestions / questionsPerRow);

//     let html = '';
//     for (let row = 0; row < numberOfRows; row++) {
//       const startQuestionIndex = row * questionsPerRow;
//       const endQuestionIndex = Math.min((row + 1) * questionsPerRow, totalQuestions);
//       const questionsInRow = endQuestionIndex - startQuestionIndex;

//       html += '<div class="question-row">';

//       for (let i = 0; i < questionsInRow; i++) {
//         const questionIndex = startQuestionIndex + i;
//         const questionNumber = questionIndex + 1;

//         html += `<div class="question">${questionNumber}: [Your question data here]</div>`;
//       }

//       html += '</div>';
//     }

//     this.renderer.setProperty(questionContainer, 'innerHTML', html);
// }


  
  

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
        width: 400
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

    // console.log("subjectData : ", subjectData);
    // console.log("labels : ", labels);
    // console.log("rightCounts : ",rightCounts);
  
    this.chartOptions = {
      chart: {
        type: 'donut',
        height: 300,
        toolbar: {
          show: false
        },
        width: 400
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
      // legend: {
      //   show: true,
      //   position: 'right',
      //   offsetY: 0,
      //   formatter: function (seriesName: any, opts: { seriesIndex: any; }) {
      //     const index = opts.seriesIndex;
      //     return labels[index] + ' Right Count: ' + rightCounts[index];
      //   },
      //   markers: {
      //     fillColors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
      //   },
      //   itemMargin: {
      //     horizontal: 5,
      //     vertical: 5
      //   }
      // },
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

    const subjectData = Object.entries(this.data.peerAverageCounts)
    .filter(([key, value]) => key.includes('Subject') && key.includes('Right Count'));



  const labels = subjectData.map(([key]) => key.replace('Subject', '').replace('Peer Right Count', '').trim());
  const rightCounts = subjectData.map(([key, value]) => Number(value));

    // const labels = [];
    // const rightCounts = [];
  
    // for (const key in this.data.peerAverageCounts) {
    //   if (key.includes("Right Count")) {
    //     const subjectName = key.split(" ")[1];
    //     labels.push(subjectName);
    //     rightCounts.push(this.data.peerAverageCounts[key]);
    //   }
    // }
  
    this.chartOptions = {
      chart: {
        type: 'donut',
        height: 300,
        toolbar: {
          show: false
        },
        width: 400
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
  
    const chart = new ApexCharts(document.querySelector("#peerAvgDonutChart"), this.chartOptions);
    chart.render();
  }
  
  
  
  generatePieChart(subject: string, container: any) {
    const totalQuestionsKey = 'Subject ' + subject + ' Total Questions';
    const rightKey = 'Subject ' + subject + ' Right Count';
    const wrongKey = 'Subject ' + subject + ' Wrong Count';
    const blankKey = 'Subject ' + subject + ' Blank Count';

    const totalQuestions = this.data?.resultData[totalQuestionsKey];
    const right = this.data?.resultData[rightKey];
    const wrong = this.data?.resultData[wrongKey];
    const blank = this.data?.resultData[blankKey];

    if (totalQuestions && right !== undefined && wrong !== undefined && blank !== undefined) {
      const percentageRight = (right / totalQuestions) * 100;
      const percentageWrong = (wrong / totalQuestions) * 100;
      const percentageBlank = (blank / totalQuestions) * 100;

      const options = {
        series: [percentageRight, percentageWrong, percentageBlank],
        labels: ['Right', 'Wrong', 'Blank'],
        chart: {
          type: 'pie',
          height: '300px', // Adjust the height as per your requirements
          width:'450px'
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
            offsetY: 0,
            offsetX: 0,
            customScale: 1,
            expandOnClick: false,
          },
        },
        dataLabels: {
          formatter: function (val: number) {
            return val.toFixed(2) + '%';
          },
          offset: -20, // Adjust the value as per your requirements
          style: {
            colors: ['#fff'],
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
          },
        },
        // Add other chart options as per your requirements
      };

      const chartContainer = this.renderer.createElement('div');
      this.renderer.addClass(chartContainer, 'chart-container');
      this.renderer.appendChild(container.nativeElement, chartContainer);

      const chart = new ApexCharts(chartContainer, options);
      chart.render();
    }
  }
  

  generatePeerPieChart(subject: string, container: any) {
    const peerRightKey = 'Subject ' + subject + ' Peer Right Count';
    const peerWrongKey = 'Subject ' + subject + ' Peer Wrong Count';
    const peerBlankKey = 'Subject ' + subject + ' Peer Blank Count';
  
    const peerRight = this.data.peerAverageCounts[peerRightKey];
    const peerWrong = this.data.peerAverageCounts[peerWrongKey];
    const peerBlank = this.data.peerAverageCounts[peerBlankKey];

    // console.log(peerRight);
  
    if (peerRight !== undefined && peerWrong !== undefined && peerBlank !== undefined) {
      const options = {
        series: [peerRight, peerWrong, peerBlank],
        labels: ['Right', 'Wrong', 'Blank'],
        chart: {
          type: 'pie',
          height: '300px', // Adjust the height as per your requirements
          width:'450px'
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
            offsetY: 0,
            offsetX: 0,
            customScale: 1,
            expandOnClick: false,
          },
        },
        dataLabels: {
          formatter: function (val: number) {
            return val.toFixed(2) + '%';
          },
          offset: -20, // Adjust the value as per your requirements
          style: {
            colors: ['#fff'],
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
          },
        },
        // Add other chart options as per your requirements
      };
  
      const chartContainer = this.renderer.createElement('div');
      this.renderer.addClass(chartContainer, 'chart-container');
      this.renderer.appendChild(container.nativeElement, chartContainer);
  
      const chart = new ApexCharts(chartContainer, options);
      chart.render();
    }
  }
  

  generateBarChart(subject: string, container: ElementRef) {
    const yourMarksKey = 'Subject ' + subject + ' Total Marks';
    const lowestMarksKey = 'Subject ' + subject + ' Peer Lowest Total Marks';
    const averageMarksKey = 'Subject ' + subject + ' Peer Average Total Marks';
    const highestMarksKey = 'Subject ' + subject + ' Peer Highest Total Marks';

    const yourMarks = this.data?.resultData[yourMarksKey];
    const lowestMarks = this.data?.subjectWiseMarks[lowestMarksKey];
    const averageMarks = this.data?.subjectWiseMarks[averageMarksKey];
    const highestMarks = this.data?.subjectWiseMarks[highestMarksKey];

    if (yourMarks !== undefined && lowestMarks !== undefined && averageMarks !== undefined && highestMarks !== undefined) {
      const options = {
        series: [
          { name: 'Your Marks', data: [yourMarks] },
          { name: 'Lowest', data: [lowestMarks] },
          { name: 'Average', data: [averageMarks] },
          { name: 'Highest', data: [highestMarks] }
        ],
        chart: {
          type: 'bar',
          height: '300px' ,// Adjust the height as per your requirements,
          width:'700px'

        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          categories: [''] // Empty string to show only one category
        },
        legend: {
          position: 'top'
        }
        // Add other chart options as per your requirements
      };

      const chart = new ApexCharts(container.nativeElement, options);
      chart.render();
    }
  }
  
  
  

  // Download whole page !
  downloadPage() {
    const doc = new jsPDF();
    const elementToCapture = this.elementRef.nativeElement.querySelector('.component-to-download');
    const options = {
      useCORS: true,
      scale: 2 // Increase the scale value to capture higher resolution
    };
  
    html2canvas(elementToCapture, options).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      const pageWidth = doc.internal.pageSize.getWidth();
     const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let remainingHeight = imgHeight;
      let currentYPos = 0;
      let currentPage = 1;
  
      while (remainingHeight > 0) {
        const currentHeight = Math.min(remainingHeight, pageHeight - (2 * margin));
  
        doc.addPage();
        doc.setPage(currentPage);
  
        const yPos = margin + currentYPos;
        doc.addImage(imageData, 'PNG', margin, yPos, imgWidth, currentHeight);
  
        remainingHeight -= currentHeight;
        currentYPos += currentHeight;
        currentPage++;
      }
  
      doc.deletePage(currentPage);
      doc.save('component.pdf');
    });
  }
    
  
  
  
  
  

  getSubjects(resultData: any): string[] {
    const subjects: string[] = [];
    for (const key in resultData) {
      if (key.includes('Subject') && !key.includes('Count') && key.includes('Total Questions')) {
        const subject = key.split(' ')[1];
        if (!subjects.includes(subject)) {
          subjects.push(subject);
        }
      }
    }
    return subjects;
  }
 
 
  


  
  
  
  
}


