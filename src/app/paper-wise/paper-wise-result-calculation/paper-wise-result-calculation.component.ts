import { Component, ElementRef, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SelectPaperWiseHeadersComponent } from '../select-paper-wise-headers/select-paper-wise-headers.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderDialogComponent } from 'src/app/header-dialog/header-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-paper-wise-result-calculation',
  templateUrl: './paper-wise-result-calculation.component.html',
  styleUrls: ['./paper-wise-result-calculation.component.css']
})
export class PaperWiseResultCalculationComponent implements OnInit {
  sortDirection: { [key: string]: boolean } = {};
  reportName: any = '';
  studentsData: any;
  answerKeyForPaperA: any;
  studentRespForPaperA: any;
  answerKeyForPaperB: any;
  studentRespForPaperB: any;
  resultPaperA: any[] = [];
  resultPaperB: any[] = [];
  maximumTotalMarks: any;
  percentagesValues: any;
  combinedResult: any[] = [];
  topicsB: any;
  resultObjectofB:any = {};
  topicBWiseMarks: any;
  peerAverageCountsOfB: any;
  topics: any;
  resultObject:any = {};
  topicWiseMarks: any = {};
  peerAverageCounts: any;
  tableResultant: any;
  headers:string[]=[];
  dataSource: any;
  tempDataSource:any;


  constructor(private dataService: DataService,
    private elementRef: ElementRef,
    private dialog : MatDialog) {}

  async ngOnInit() {
    await this.getPaperWiseData();
    if(this.answerKeyForPaperA.length){
     this.calcuateResultOfPaperA(this.answerKeyForPaperA, this.studentRespForPaperA);
    }

    if(this.answerKeyForPaperB.length){
    this.calcuateResultOfPaperB(this.answerKeyForPaperB, this.studentRespForPaperB);
    }
    

    
    this.generateCombinedResult();

  }

  generateCombinedResult(){
    const combinedArray = [...this.resultPaperA, ...this.resultPaperB];
    // this.combinedResult =[...this.resultPaperA, ...this.resultPaperB];
    console.log("combinedArray is ====> ",combinedArray);

    // Group results by RollNo
  const groupedResults = combinedArray.reduce((acc, curr) => {
    const rollNo = curr.RollNo;
    if (!acc[rollNo]) {
      acc[rollNo] = [];
    }
    acc[rollNo].push(curr);
    return acc;
  }, {});

  // Calculate total marks for each RollNo
  for (const rollNo in groupedResults) {
    const results = groupedResults[rollNo];
    const totalMarksObtained = results.reduce((sum: any, result: any) => sum + result['Total Marks Obtained'], 0);
    const totalMarks = results.reduce((sum : any, result : any) => sum + result['Total Marks'], 0);
    const totalRightCount = results.reduce((sum : any, result : any) => sum + result['Total Right Count'], 0);
    const totalWrongCount = results.reduce((sum : any, result : any) => sum + result['Total Wrong Count'], 0);
    const totalBlankCount = results.reduce((sum : any, result : any) => sum + result['Total Blank Count'], 0);
    const totalRightMarks = results.reduce((sum : any, result : any) => sum + result['Total Right Marks'], 0);
    const totalWrongMarks = results.reduce((sum : any, result : any) => sum + result['Total Wrong Marks'], 0);

    


    this.combinedResult.push({
      RollNo: parseInt(rollNo),
      'Total Marks Obtained': totalMarksObtained,
      'Total Marks': totalMarks,
      'Total Right Count':totalRightCount ,
      'Total Wrong Count': totalWrongCount,
      'Total Blank Count' :totalBlankCount,
      'Total Right Marks':totalRightMarks ,
      'Total Wrong Marks' :totalWrongMarks 
    });
  }

  console.log("combinedResult is ====> ", this.combinedResult);

  this.calculateOverallRankAndPercentage();
  return this.combinedResult;
  }

  async getPaperWiseData() {
    const reportData = await this.dataService.getReportData();
    this.studentsData = reportData['studentDetails'];
    this.answerKeyForPaperA = reportData['answerKeyFileForPaperA'];
    this.studentRespForPaperA = reportData['studentResponsesFileForPaperA'];
    this.answerKeyForPaperB = reportData['answerKeyFileForPaperB'];
    this.studentRespForPaperB = reportData['studentResponsesFileForPaperB'];


  }

   calcuateResultOfPaperA(answerKey: any[], studentResponses: any[]) {

    const questionStats :any = {}; // Object to store question statistics

    for (let i = 0; i < studentResponses.length; i++) {
      let obj: any = {};
      let topic_wise_marks: any = {};
      let topic_wise_count: any = {}; // Add topic_wise_count object
      let total_marks = 0;
      let total_right_marks = 0;
      let total_wrong_marks = 0;
      let total_right_count = 0;
      let total_wrong_count = 0;
      let total_blank_count = 0;

      // Calculate the TotalOutOf marks for all questions
      let totalOutOfMarks = 0;
      for (let question of answerKey) {
        totalOutOfMarks += question.FullMarks;
      }

      // Adding RollNo in results array
      obj["RollNo"] = studentResponses[i]["RollNo"];

      //console.log("obj['RollNo']", obj["RollNo"]);
      //console.log('studentResponses[i]["RollNo"]', studentResponses[i]["RollNo"]);

      for (let j = 0; j < answerKey.length; j++) {
        let question = "Question" + (j + 1);
        let answer = studentResponses[i][question];
        let correct_answer = answerKey[j].Key;
        let full_marks =  answerKey[j].FullMarks;
        let partial_marks = answerKey[j]["Partial Marks"];
        let negative_marks = answerKey[j]["Negative Marks"];

        let topic = this.answerKeyForPaperA[j].Topic;

        this.topics =  this.answerKeyForPaperA[j].Topic;


        if (!questionStats[question]) {
          questionStats[question] = {
            "Total Right": 0,
            "Total Wrong": 0,
            "Total Blank": 0
          };
        }

        // Adding values for headers like Q1, Q2....so on
        if (answer == correct_answer) {
         
          obj[question] = full_marks;
          total_marks += full_marks;
          total_right_marks += full_marks;
          total_right_count++;
        } 
        else if (answer) {
          obj[question] = negative_marks;
          total_marks += negative_marks;
          total_wrong_marks += negative_marks;
          total_wrong_count++;
        } else {
          obj[question] = 0;
          total_blank_count++;
        }

        //Adding values for topic-wise headers
        if (topic) {
          if (!topic_wise_marks[topic]) {
            topic_wise_marks[topic] = {};
            topic_wise_marks[topic]['Right'] = 0;
            topic_wise_marks[topic]['Wrong'] = 0;
            topic_wise_marks[topic]['Blank'] = 0;
            topic_wise_marks[topic]['Total'] = 0;
            topic_wise_count[topic] = {}; // Initialize topic_wise_count object
            topic_wise_count[topic]['Right'] = 0;
            topic_wise_count[topic]['Wrong'] = 0;
            topic_wise_count[topic]['Blank'] = 0;
          }

          if (answer == correct_answer) {
            topic_wise_marks[topic]['Right'] += full_marks;
            topic_wise_count[topic]['Right'] += 1; // Increment right count

            questionStats[question]["Total Right"]++;

          } else if (answer) {
            topic_wise_marks[topic]['Wrong'] += negative_marks;
            topic_wise_count[topic]['Wrong'] += 1; // Increment wrong count
            questionStats[question]["Total Wrong"]++;

          } else {
            topic_wise_marks[topic]['Blank'] -= partial_marks;
            topic_wise_count[topic]['Blank'] += 1; // Increment blank count

            questionStats[question]["Total Blank"]++;

          }

          topic_wise_marks[topic]['Total'] = topic_wise_marks[topic]['Right'] + topic_wise_marks[topic]['Wrong'] + topic_wise_marks[topic]['Blank'];
        }

      }

      
      // Create a variable to store the total marks for each topic
      let topic_wise_total_marks: { [key: string]: number } = {};

      // Iterate through the answer_key to calculate the total marks for each topic
      for (let question of this.answerKeyForPaperA) {
        const topic = question.Topic;
        if (topic_wise_total_marks[topic]) {
          topic_wise_total_marks[topic] += question.FullMarks;
        } else {
          topic_wise_total_marks[topic] = question.FullMarks;
        }
      }

      //Adding topic-wise marks and count to the object
      for (let topic in topic_wise_marks) {
        obj['Topic ' + topic + ' Right Count'] = topic_wise_count[topic]['Right']; // Topic-wise right count
        obj['Topic ' + topic + ' Wrong Count'] = topic_wise_count[topic]['Wrong']; // Topic-wise wrong count
        obj['Topic ' + topic + ' Blank Count'] = topic_wise_count[topic]['Blank']; // Topic-wise blank count

        obj['Topic ' + topic + ' Right'] = topic_wise_marks[topic]['Right']; // Topic-wise right marks
        obj['Topic' + topic + ' Wrong'] = topic_wise_marks[topic]['Wrong']; // Topic-wise wrong marks
        obj['Topic ' + topic + ' Blank'] = topic_wise_marks[topic]['Blank'];
        obj['Topic ' + topic + ' Total Marks Obtained'] = parseFloat(topic_wise_marks[topic]['Total']);
        
        
        // Add the TotalOutOf marks to the object
        obj['Topic ' + topic + ' Total Marks'] = topic_wise_total_marks[topic];

        // Calculate Topic Percentage
       
        const topicPercentage = (obj['Topic ' + topic + ' Total Marks Obtained'] / obj['Topic ' + topic + ' Total Marks'] ) *100;
        (topicPercentage>0)? obj['Topic ' + topic + ' Percentage'] = topicPercentage:obj['Topic ' + topic + ' Percentage'] = 0;
       
        // Calculate Total Questions in Topic
        const topicTotalQuestions = this.answerKeyForPaperA.filter((item: { Topic: string; }) => item.Topic === topic).length;
        obj['Topic ' + topic + ' Total Questions'] = topicTotalQuestions;

      }

       // Adding total marks obtained and total marks to the object
    obj['Total Marks Obtained'] = total_marks; // total marks obtained by the student
    obj['Total Marks'] = totalOutOfMarks; // Calculate totalMarks (Out of marks)

    // Adding total_right_marks and total_wrong_marks to the object
    obj['Total Right Marks'] = total_right_marks;
    obj['Total Wrong Marks'] = total_wrong_marks;

    // Adding total_right_count, total_wrong_count, and total_blank_count to the object
    obj['Total Right Count'] = total_right_count;
    obj['Total Wrong Count'] = total_wrong_count;
    obj['Total Blank Count'] = total_blank_count;
 
      this.resultPaperA[i] = obj;
    }

     // Calculate percentages and store in the result object
  const totalStudents = this.answerKeyForPaperA.length;
  for (const question in questionStats) {
    const totalRight = questionStats[question]["Total Right"];
    const totalWrong = questionStats[question]["Total Wrong"];
    const totalBlank = questionStats[question]["Total Blank"];

    const totalRightPercentage = (totalRight / totalStudents) * 100;
    const totalWrongPercentage = (totalWrong / totalStudents) * 100;
    const totalBlankPercentage = (totalBlank / totalStudents) * 100;

    this.resultObject[`${question} Total Right`] = totalRightPercentage;
    this.resultObject[`${question} Total Wrong`] = totalWrongPercentage;
    this.resultObject[`${question} Total Blank`] = totalBlankPercentage;
  }

    console.log("resultObjectA",this.resultObject);
    this.calculateRankAndPercentageForPaperA(answerKey);
    this.calculateTopicWiseMarksForPaperA();
    this.calculateTopicWiseRankForPaperA();
    this.calculatePeerAverageCountForPaperA();
  }

  calculateRankAndPercentageForPaperA(answerKey: any[]) {
    // Calculate the rank and percentage for each student
    const totalStudents = this.resultPaperA.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;

    let previousTotalMarks = null;
    let currentRank = 0;
    let currentPercentageRank = 0;

    // Sort the students based on total marks obtained temporarily
    const sortedResults = [...this.resultPaperA].sort((a, b) => b["Total Marks Obtained"] - a["Total Marks Obtained"]);

    for (let i = 0; i < totalStudents; i++) {
      const student = sortedResults[i];

      if (student["Total Marks Obtained"] !== previousTotalMarks) {
        // Update the rank only if the total marks obtained are different
        currentRank = i + 1;
        currentPercentageRank = i + 1;
      }

      const resultIndex = this.resultPaperA.findIndex((result) => result["RollNo"] === student["RollNo"]);
      if (resultIndex !== -1) {
        const result = this.resultPaperA[resultIndex];

        // Calculate and store the rank and percentage in separate variables
        const rank = currentRank;

        let percentage;
        if (result["Total Marks Obtained"] < 0) {
          percentage = 0;
        } else {
          percentage = (result["Total Marks Obtained"] / this.calculateMaximumTotalMarks(answerKey)) * 100;
          totalPercentage += percentage;
          lowestPercentage = Math.min(lowestPercentage, percentage);
          highestPercentage = Math.max(highestPercentage, percentage);
        }

        // Update the result object with the calculated values
        result["Rank"] = rank;
        result["Percentage"] = percentage;
      }

      previousTotalMarks = student["Total Marks Obtained"];
    }

    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage,
    };

     // console.log("Lowest Percentage:", lowestPercentage);
    // console.log("Highest Percentage:", highestPercentage);
    // console.log("Average Percentage:", averagePercentage);
    
  }

  calculateTopicWiseMarksForPaperA() {
    const topicWiseMarks: any = {};
  
    // Iterate over all topics in the answer key
    for (const answer of this.answerKeyForPaperA) {
      const topicName = answer.Topic;
      const topicKey = `Topic ${topicName}`;
  
      // Calculate the peer lowest, average, and highest total marks for the topic
      let peerLowestTotalMarks = Infinity;
      let peerHighestTotalMarks = -Infinity;
      let peerTotalMarks = 0;
      let peerCount = 0;
  
      for (const student of this.resultPaperA) {
        const totalMarks = student[`${topicKey} Total Marks Obtained`] || 0;
  
        if (totalMarks < peerLowestTotalMarks) {
          peerLowestTotalMarks = totalMarks;
        }
  
        if (totalMarks > peerHighestTotalMarks) {
          peerHighestTotalMarks = totalMarks;
        }
  
        peerTotalMarks += totalMarks;
        peerCount++;
      }
  
      const peerAverageTotalMarks = peerTotalMarks / peerCount;
  
      // Store the topic-wise marks in the topicWiseMarks object
      topicWiseMarks[`${topicKey} Peer Lowest Total Marks`] = peerLowestTotalMarks;
      topicWiseMarks[`${topicKey} Peer Average Total Marks`] = peerAverageTotalMarks;
      topicWiseMarks[`${topicKey} Peer Highest Total Marks`] = peerHighestTotalMarks;
    }
  
    // Store the calculated topic-wise marks in the instance variable
    this.topicWiseMarks = topicWiseMarks;
    console.log("Topic-wise Marks A:", this.topicWiseMarks);
  }

  calculateTopicWiseRankForPaperA() {
    // Loop through each topic in the answer key
    for (let i = 0; i < this.answerKeyForPaperA.length; i++) {
      const topic = this.answerKeyForPaperA[i].Topic;
  
      // Create a temporary array to store the students' percentages for this topic
      const topicPercentages = [];
  
      // Loop through each student's result
      for (let studentResult of this.resultPaperA) {
        // Extract the student's percentage for the current topic
        const topicPercentage = studentResult['Topic ' + topic + ' Percentage'];
  
        // Add the percentage to the temporary array
        topicPercentages.push(topicPercentage);
      }
  
      // Sort the topic percentages in descending order to calculate ranks
      const sortedPercentages = topicPercentages.slice().sort((a, b) => b - a);
  
      // Loop through each student's result again to calculate their rank for the topic
      for (let studentResult of this.resultPaperA) {
        const topicPercentage = studentResult['Topic ' + topic + ' Percentage'];
  
        // Find the index of the student's percentage in the sorted array
        const topicRank = sortedPercentages.indexOf(topicPercentage) + 1;
  
        // Update the student's result object with the calculated rank for the topic
        studentResult['Topic ' + topic + ' Rank'] = topicRank;
        //console.log("rank",topicRank);
      }
    }
  }

  calculatePeerAverageCountForPaperA() {
    const peerAverageCounts: any = {}; // Object to store the peer average counts
  
    // Iterate over all students' results
    for (const student of this.resultPaperA) {
      // Iterate over each topic in the student's result
      for (const key in student) {
        if (key.startsWith("Topic") && key.endsWith("Right Count")) {
          const topicName = key.split(" ")[1]; // Extract topic name from the key
          const rightCountKey = `Topic ${topicName} Peer Right Count`;
          const wrongCountKey = `Topic ${topicName} Peer Wrong Count`;
          const blankCountKey = `Topic ${topicName} Peer Blank Count`;
  
          if (!peerAverageCounts[rightCountKey]) {
            peerAverageCounts[rightCountKey] = 0;
          }
  
          if (!peerAverageCounts[wrongCountKey]) {
            peerAverageCounts[wrongCountKey] = 0;
          }
  
          if (!peerAverageCounts[blankCountKey]) {
            peerAverageCounts[blankCountKey] = 0;
          }
  
          peerAverageCounts[rightCountKey] += student[key] || 0; // Add the right count to the topic-wise total
          peerAverageCounts[wrongCountKey] += student[key.replace("Right", "Wrong")] || 0; // Add the wrong count to the topic-wise total
          peerAverageCounts[blankCountKey] += student[key.replace("Right", "Blank")] || 0; // Add the blank count to the topic-wise total
        }
      }
    }
  
    // Calculate the average counts
    for (const key in peerAverageCounts) {
      if (peerAverageCounts.hasOwnProperty(key)) {
        peerAverageCounts[key] /= this.resultPaperA.length;
      }
    }
  
    // Store the calculated peer average counts in the instance variable
    this.peerAverageCounts = peerAverageCounts;
    //console.log("Peer Average Count:", this.peerAverageCounts);
  }


  calcuateResultOfPaperB(answerKey: any[], studentResponses: any[]) {
    const questionStatsofB :any = {}; // Object to store question statistics
    for (let i = 0; i < studentResponses.length; i++) {
      let obj: any = {};
      let topicB_wise_marks: any = {};
      let topicB_wise_count: any = {}; // Add topicB_wise_count object
      let total_right_marks = 0;
      let total_wrong_marks = 0;
      let total_marks = 0;
      let total_right_count = 0;
      let total_wrong_count = 0;
      let total_blank_count = 0;

      // Calculate the TotalOutOf marks for all questions
      let totalOutOfMarks = 0;
      for (let question of answerKey) {
        totalOutOfMarks += question.FullMarks;
      }

      // Adding RollNo in results array
      obj["RollNo"] = studentResponses[i]["RollNo"];
      
      console.log("obj['RollNo']", obj["RollNo"]);
      console.log('this.studentResponses[i]["RollNo"]', studentResponses[i]["RollNo"]);

      for (let j = 0; j < answerKey.length; j++) {
        let question = "Question" + (j + 1);
        let answer = studentResponses[i][question];
        let correct_answer = answerKey[j].Key;
        let full_marks =  answerKey[j].FullMarks;
        let partial_marks = answerKey[j]["Partial Marks"];
        let negative_marks = answerKey[j]["Negative Marks"];

        let topicB = this.answerKeyForPaperB[j].Topic;

        this.topicsB =  this.answerKeyForPaperB[j].Topic;

        if (!questionStatsofB[question]) {
          questionStatsofB[question] = {
            "Total Right": 0,
            "Total Wrong": 0,
            "Total Blank": 0
          };
        }

        // Adding values for headers like Q1, Q2....so on
        if (answer == correct_answer) {
          obj[question] = full_marks;
          total_marks += full_marks;
          total_right_marks += full_marks;
          total_right_count++;
        } 
        else if (answer) {
          obj[question] = negative_marks;
          total_marks += negative_marks;
          total_wrong_marks += negative_marks;
          total_wrong_count++;
        } else {
          obj[question] = 0;
          total_blank_count++;
        }

         //Adding values for topicB-wise headers
         if (topicB) {
          if (!topicB_wise_marks[topicB]) {
            topicB_wise_marks[topicB] = {};
            topicB_wise_marks[topicB]['Right'] = 0;
            topicB_wise_marks[topicB]['Wrong'] = 0;
            topicB_wise_marks[topicB]['Blank'] = 0;
            topicB_wise_marks[topicB]['Total'] = 0;
            topicB_wise_count[topicB] = {}; // Initialize topicB_wise_count object
            topicB_wise_count[topicB]['Right'] = 0;
            topicB_wise_count[topicB]['Wrong'] = 0;
            topicB_wise_count[topicB]['Blank'] = 0;
          }

          if (answer == correct_answer) {
            topicB_wise_marks[topicB]['Right'] += full_marks;
            topicB_wise_count[topicB]['Right'] += 1; // Increment right count

            questionStatsofB[question]["Total Right"]++;

          } else if (answer) {
            topicB_wise_marks[topicB]['Wrong'] += negative_marks;
            topicB_wise_count[topicB]['Wrong'] += 1; // Increment wrong count
            questionStatsofB[question]["Total Wrong"]++;

          } else {
            topicB_wise_marks[topicB]['Blank'] -= partial_marks;
            topicB_wise_count[topicB]['Blank'] += 1; // Increment blank count

            questionStatsofB[question]["Total Blank"]++;

          }

          topicB_wise_marks[topicB]['Total'] = topicB_wise_marks[topicB]['Right'] + topicB_wise_marks[topicB]['Wrong'] + topicB_wise_marks[topicB]['Blank'];
        }

      }

      // Create a variable to store the total marks for each topicB
      let topicB_wise_total_marks: { [key: string]: number } = {};

      // Iterate through the answer_key to calculate the total marks for each topicB
      for (let question of this.answerKeyForPaperB) {
        const topicB = question.Topic;
        if (topicB_wise_total_marks[topicB]) {
          topicB_wise_total_marks[topicB] += question.FullMarks;
        } else {
          topicB_wise_total_marks[topicB] = question.FullMarks;
        }
      }

      //Adding  topicB-wise marks and count to the object
      for (let topicB in  topicB_wise_marks) {
        obj['Topic ' +  topicB + ' Right Count'] =  topicB_wise_count[ topicB]['Right']; // Topic-wise right count
        obj['Topic ' +  topicB + ' Wrong Count'] =  topicB_wise_count[ topicB]['Wrong']; // Topic-wise wrong count
        obj['Topic ' +  topicB + ' Blank Count'] =  topicB_wise_count[ topicB]['Blank']; // Topic-wise blank count

        obj['Topic' +  topicB + ' Right'] =  topicB_wise_marks[ topicB]['Right']; // Topic-wise right marks
        obj['Topic' +  topicB + ' Wrong'] =  topicB_wise_marks[ topicB]['Wrong']; // Topic-wise wrong marks
        obj['Topic ' + topicB + ' Blank'] = topicB_wise_marks[topicB]['Blank'];
        obj['Topic ' + topicB + ' Total Marks Obtained'] = parseFloat(topicB_wise_marks[topicB]['Total']);
        
        // Add the TotalOutOf marks to the object
        obj['Topic ' +  topicB + ' Total Marks'] =  topicB_wise_total_marks[ topicB];

        // Calculate Topic Percentage
       
        const  topicBPercentage = (obj['Topic ' +  topicB + ' Total Marks Obtained'] / obj['Topic ' +  topicB + ' Total Marks'] ) *100;
        ( topicBPercentage>0)? obj['Topic ' +  topicB + ' Percentage'] =  topicBPercentage:obj['Topic ' + topicB + ' Percentage'] = 0;
       
        // Calculate Total Questions in Topic
        const  topicBTotalQuestions = this.answerKeyForPaperB.filter((item: { Topic: string; }) => item.Topic ===  topicB).length;
        obj['Topic ' + topicB + ' Total Questions'] =  topicBTotalQuestions;

      }

   //Adding total right, wrong, and blank marks to the object
   obj['Total Right Marks'] = total_right_marks;
   obj['Total Wrong Marks'] = total_wrong_marks;
   obj['Total Marks Obtained'] = total_marks; // total marks obtained by the student

   //Putting total count of right, wrong, and blank
   obj['Total Right Count'] = total_right_count;
   obj['Total Wrong Count'] = total_wrong_count;
   obj['Total Blank Count'] = total_blank_count;

    // Calculate totalMarks (Out of marks)
   obj['Total Marks'] = totalOutOfMarks;

      console.log("i =>",i);
      this.resultPaperB[i] = obj;
      console.log(" obj , ",  obj);
    }

    // Calculate percentages and store in the result object
  const totalStudents = this.studentRespForPaperB.length;
  for (const question in questionStatsofB) {
    const totalRight = questionStatsofB[question]["Total Right"];
    const totalWrong = questionStatsofB[question]["Total Wrong"];
    const totalBlank = questionStatsofB[question]["Total Blank"];

    const totalRightPercentage = (totalRight / totalStudents) * 100;
    const totalWrongPercentage = (totalWrong / totalStudents) * 100;
    const totalBlankPercentage = (totalBlank / totalStudents) * 100;

    this.resultObjectofB[`${question} Total Right`] = totalRightPercentage;
    this.resultObjectofB[`${question} Total Wrong`] = totalWrongPercentage;
    this.resultObjectofB[`${question} Total Blank`] = totalBlankPercentage;
  }

   console.log("resultObjectofB",this.resultObjectofB);

    this.calculateRankAndPercentageForPaperB(answerKey);
    this.calculateTopicWiseMarksForPaperB();
    this.calculateTopicWiseRankForPaperB();
    this.calculatePeerAverageCountForPaperB();
  }

  calculatePeerAverageCountForPaperB()
  {
      const peerAverageCountsofB: any = {}; // Object to store the peer average counts
    
      // Iterate over all students' results
      for (const student of this.resultPaperB) {
        // Iterate over each topicB in the student's result
        for (const key in student) {
          if (key.startsWith("Topic") && key.endsWith("Right Count")) {
            const topicBName = key.split(" ")[1]; // Extract topicB name from the key
            const rightCountKey = `Topic ${topicBName} Peer Right Count`;
            const wrongCountKey = `Topic ${topicBName} Peer Wrong Count`;
            const blankCountKey = `Topic ${topicBName} Peer Blank Count`;
    
            if (!peerAverageCountsofB[rightCountKey]) {
              peerAverageCountsofB[rightCountKey] = 0;
            }
    
            if (!peerAverageCountsofB[wrongCountKey]) {
              peerAverageCountsofB[wrongCountKey] = 0;
            }
    
            if (!peerAverageCountsofB[blankCountKey]) {
              peerAverageCountsofB[blankCountKey] = 0;
            }
    
            peerAverageCountsofB[rightCountKey] += student[key] || 0; // Add the right count to the topicB-wise total
            peerAverageCountsofB[wrongCountKey] += student[key.replace("Right", "Wrong")] || 0; // Add the wrong count to the topicB-wise total
            peerAverageCountsofB[blankCountKey] += student[key.replace("Right", "Blank")] || 0; // Add the blank count to the topicB-wise total
          }
        }
      }
    
      // Calculate the average counts
      for (const key in peerAverageCountsofB) {
        if (peerAverageCountsofB.hasOwnProperty(key)) {
          peerAverageCountsofB[key] /= this.resultPaperB.length;
        }
      }
    
      // Store the calculated peer average counts in the instance variable
      this.peerAverageCountsOfB = peerAverageCountsofB;
      // console.log("Peer Average Count:", this.peerAverageCounts);
  }

  calculateTopicWiseRankForPaperB(){
    // Loop through each topicB in the answer key
    for (let i = 0; i < this.answerKeyForPaperB.length; i++) {
      const topicB = this.answerKeyForPaperB[i].Topic;
  
      // Create a temporary array to store the students' percentages for this topicB
      const topicBPercentages = [];
  
      // Loop through each student's result
      for (let studentResult of this.resultPaperB) {
        // Extract the student's percentage for the current topicB
        const topicBPercentage = studentResult['Topic ' +topicB + ' Percentage'];
  
        // Add the percentage to the temporary array
        topicBPercentages.push(topicBPercentage);
      }
  
      // Sort the topicB percentages in descending order to calculate ranks
      const sortedPercentages = topicBPercentages.slice().sort((a, b) => b - a);
  
      // Loop through each student's result again to calculate their rank for the topicB
      for (let studentResult of this.resultPaperB) {
        const topicBPercentage = studentResult['Topic ' + topicB + ' Percentage'];
  
        // Find the index of the student's percentage in the sorted array
        const topicBRank = sortedPercentages.indexOf(topicBPercentage) + 1;
  
        // Update the student's result object with the calculated rank for the topicB
        studentResult['Topic ' + topicB + ' Rank'] = topicBRank;
      }
    }
  }

  calculateTopicWiseMarksForPaperB(){
    const topicBWiseMarks: any = {};
  
    // Iterate over all topics in the answer key
    for (const answer of this.answerKeyForPaperB) {
      const topicBName = answer.Topic;
      const topicBKey = `Topic ${topicBName}`;
  
      // Calculate the peer lowest, average, and highest total marks for the topic
      let peerLowestTotalMarks = Infinity;
      let peerHighestTotalMarks = -Infinity;
      let peerTotalMarks = 0;
      let peerCount = 0;
  
      for (const student of this.resultPaperB) {
        const totalMarks = student[`${topicBKey} Total Marks Obtained`] || 0;
  
        if (totalMarks < peerLowestTotalMarks) {
          peerLowestTotalMarks = totalMarks;
        }
  
        if (totalMarks > peerHighestTotalMarks) {
          peerHighestTotalMarks = totalMarks;
        }
  
        peerTotalMarks += totalMarks;
        peerCount++;
      }
  
      const peerAverageTotalMarks = peerTotalMarks / peerCount;
  
      // Store the topicB-wise marks in the topicBWiseMarks object
      topicBWiseMarks[`${topicBKey} Peer Lowest Total Marks`] = peerLowestTotalMarks;
      topicBWiseMarks[`${topicBKey} Peer Average Total Marks`] = peerAverageTotalMarks;
      topicBWiseMarks[`${topicBKey} Peer Highest Total Marks`] = peerHighestTotalMarks;
    }
  
    // Store the calculated topicB-wise marks in the instance variable
    this.topicBWiseMarks = topicBWiseMarks;
    console.log("Topic-wise Marks:", this.topicBWiseMarks);
  }

  calculateRankAndPercentageForPaperB(answerKey: any[]) {
    // Calculate the rank and percentage for each student
    const totalStudents = this.resultPaperB.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;

    let previousTotalMarks = null;
    let currentRank = 0;
    let currentPercentageRank = 0;

    // Sort the students based on total marks obtained temporarily
    const sortedResults = [...this.resultPaperB].sort((a, b) => b["Total Marks Obtained"] - a["Total Marks Obtained"]);

    for (let i = 0; i < totalStudents; i++) {
      const student = sortedResults[i];

      if (student["Total Marks Obtained"] !== previousTotalMarks) {
        // Update the rank only if the total marks obtained are different
        currentRank = i + 1;
        currentPercentageRank = i + 1;
      }

      const resultIndex = this.resultPaperB.findIndex((result) => result["RollNo"] === student["RollNo"]);
      if (resultIndex !== -1) {
        const result = this.resultPaperB[resultIndex];

        // Calculate and store the rank and percentage in separate variables
        const rank = currentRank;

        let percentage;
        if (result["Total Marks Obtained"] < 0) {
          percentage = 0;
        } else {
          percentage = (result["Total Marks Obtained"] / this.calculateMaximumTotalMarks(answerKey)) * 100;
          totalPercentage += percentage;
          lowestPercentage = Math.min(lowestPercentage, percentage);
          highestPercentage = Math.max(highestPercentage, percentage);
        }

        // Update the result object with the calculated values
        result["Rank"] = rank;
        result["Percentage"] = percentage;
      }

      previousTotalMarks = student["Total Marks Obtained"];
    }

    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage,
    };

    
  }



  calculateOverallRankAndPercentage() {
    const totalStudents = this.combinedResult.length;
    let totalPercentage = 0;
    let lowestPercentage = Infinity;
    let highestPercentage = -Infinity;
  
    let previousTotalMarks = null;
    let currentRank = 0;
  
    // Sort the students based on total marks obtained temporarily
    const sortedResults = [...this.combinedResult].sort((a, b) => b["Total Marks Obtained"] - a["Total Marks Obtained"]);
  
    for (let i = 0; i < totalStudents; i++) {
      const student = sortedResults[i];
  
      if (student["Total Marks Obtained"] !== previousTotalMarks) {
        // Update the rank only if the total marks obtained are different
        currentRank = i + 1;
      }
  
      // Calculate and store the rank and percentage in separate variables
      const rank = currentRank;
      let percentage = (student["Total Marks Obtained"] / student["Total Marks"]) * 100;
      percentage = Math.max(percentage, 0); // Make sure percentage is at least 0
      totalPercentage += percentage;
      lowestPercentage = Math.min(lowestPercentage, percentage);
      highestPercentage = Math.max(highestPercentage, percentage);
  
      // Update the result object with the calculated values
      student["Rank"] = rank;
      student["Percentage"] = percentage;
  
      previousTotalMarks = student["Total Marks Obtained"];
    }
  
    const averagePercentage = totalPercentage / totalStudents;
    this.percentagesValues = {
      lowestPercentage: lowestPercentage,
      highestPercentage: highestPercentage,
      averagePercentage: averagePercentage,
    };
  }


  calculateMaximumTotalMarks(answerKey: any[]) {
    return answerKey.reduce((totalMarks: number, question: any) => {
   
      return totalMarks + question["FullMarks"];
    }, 0);
  }


  
  sort(header: string) {
    const data = this.dataSource.filteredData.slice();
    const isNumeric = !isNaN(parseFloat(data[0][header])) && isFinite(data[0][header]);
    
    // toggle the sorting order for the current column
    this.sortDirection[header] = !this.sortDirection[header];
    
    if (isNumeric) {
      data.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
        if (this.sortDirection[header]) {
          return a[header] - b[header]; // sort in ascending order
        } else {
          return b[header] - a[header]; // sort in descending order
        }
      });
    } else {
      data.sort((a: { [x: string]: any; }, b: { [x: string]: string; }) => {
        if (this.sortDirection[header]) {
          return a[header].localeCompare(b[header]); // sort in ascending order
        } else {
          return b[header].localeCompare(a[header]); // sort in descending order
        }
      });
    }
    
    this.dataSource.data = data;
  }
  

   openPopup(studentRespForPaperA: any, studentRespForPaperB: any): void {
  // Combine the response data for both papers into a single array
  const combinedResponseData = [...studentRespForPaperA, ...studentRespForPaperB];

  // Filter out headers starting with "Question" followed by a numerical value
  const filteredData = combinedResponseData.map((dataObj: { [x: string]: any; }) => {
    const filteredObj: any = {};
    for (const key in dataObj) {
      if (!(key.startsWith("Question") && /\d/.test(key))) {
        filteredObj[key] = dataObj[key];
      }
    }
    return filteredObj;
  });

  const dialogRef = this.dialog.open(SelectPaperWiseHeadersComponent, {
    width: '60%',
    data: {
      studentsData: this.studentsData,
      studentsDataHeaders: Object.keys(this.studentsData[0]),
      combinedResult: this.combinedResult,
      combinedResultHeaders: Object.keys(this.combinedResult[0]),
      resultPaperAHeaders: Object.keys(this.resultPaperA[0]),
      resultPaperA: this.resultPaperA, // Pass resultPaperA here
      resultPaperBHeaders: Object.keys(this.resultPaperB[0]),
      resultPaperB: this.resultPaperB, // Pass resultPaperB here
      filteredData: filteredData, // Pass filteredData here
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    this.tableResultant = result;
    console.log("this.tableResultant : ", this.tableResultant);
    this.headers = Object.keys(this.tableResultant);
    this.dataSource = new MatTableDataSource(this.convertToDataSource());
    console.log("this.dataSource : ", this.dataSource);
    this.tempDataSource = this.dataSource;
  });
}

  convertToDataSource() {
    if (!this.tableResultant) {
      return [];
    }
  
    const data = [];
    const properties = Object.keys(this.tableResultant);
    const length = this.tableResultant[properties[0]].length; // Get the length from one of the properties
  
    for (let i = 0; i < length; i++) {
      const row: any = {};
      for (const key in this.tableResultant) {
        row[key] = this.tableResultant[key][i];
      }
      data.push(row);
    }
  
    // Sort the data based on the "RollNo" property
    data.sort((a, b) => a["RollNo"] - b["RollNo"]);
  
    return data;
  }
  exportToPdf(): void {
    const totalHeaders = this.headers.length;
    const orientation = totalHeaders <= 7 ? 'portrait' : 'landscape';
  
    const doc = new jsPDF({
      orientation: orientation,
      unit: 'pt',
      format: [792, 612],
    });
  
    const tableData = [];
    const headerRow = [];
  
    for (const header of this.headers) {
      headerRow.push(header);
    }
  
    tableData.push(headerRow);
  
    for (const element of this.dataSource.filteredData) {
      const dataRow = [];
      for (const header of this.headers) {
        dataRow.push(element[header]);
      }
      tableData.push(dataRow);
    }
  
    const tableConfig:any = {
      head: tableData.slice(0, 1),
      body: tableData.slice(1),
      styles: {
        fontSize: totalHeaders > 10 ? 10 : 12,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {},
    };
  
    if (totalHeaders > 7) {
      tableConfig.styles.cellPadding = 2;
      tableConfig.columnStyles = {
        ...tableConfig.columnStyles,
        // Adjust the cell width for each column as needed
        // You can set a fixed width or calculate it dynamically based on content length
      };
    }
  
    autoTable(doc, tableConfig);
  
    doc.save('table_data.pdf');
  }
  
  
  

  exportToCsv(): void {
    const csvRows = [];

    // Header row
    const headerRow = this.headers.join(',');
    csvRows.push(headerRow);

    // Data rows
    for (const element of this.dataSource.filteredData) {
      const dataRow = [];
      for (const header of this.headers) {
        const value = element[header];
        const csvValue = value !== null && value !== undefined ? value.toString() : '';
        dataRow.push(csvValue);
      }
      const csvRow = dataRow.join(',');
      csvRows.push(csvRow);
    }

    // Generate CSV content
    const csvContent = csvRows.join('\n');

    // Create a Blob object and a temporary link element
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set link properties
    link.href = url;
    link.download = 'table_data.csv';

    // Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }


//Adding S No manually !
getHeaderRowDef(): string[] {
  return ['sno', ...this.headers];
}

getRowDef(): string[] {
  return ['sno', ...this.headers];
}

onRowClick(row: any) {
  
}


 
//Download whole page !
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

//for filtering
onHeaderClick(header : any){
  // console.log("header : ", header);
  const headerValues = this.dataSource.data.map((element:any) => element[header]);

const requiredData = {
  header: headerValues,
  dataSource:this.dataSource
}

// console.log(requiredData);
}

openHeaderDialog(header: string): void {

  const data = {
    header: header,
    headerValues: this.dataSource.filteredData.map((element:any) => element[header]),
    dataSource: this.dataSource
  };

  // if values are same , then show once !
  
  const uniqueHeaderValues = [...new Set(data.headerValues)];
  const headerValues = uniqueHeaderValues.filter((value, index, array) => array.indexOf(value) === index);
  
  data.headerValues = headerValues;
  

  const dialogRef = this.dialog.open(HeaderDialogComponent, {
    data: data
  });

  dialogRef.afterClosed().subscribe(newDataSource => {
    if (newDataSource) {
      // console.log("newDataSource: ", newDataSource);
      this.dataSource = new MatTableDataSource(newDataSource.newDataSource);
      // Perform any further actions with the selected values

      // console.log("DATA SOURCE ",this.dataSource );
    }
  });
}


clearAllFilters(){
  //recover dataSource data as it was earlier

  this.dataSource = this.tempDataSource;
  // console.log("DATA SOURCE : ", this.dataSource);
}

}
