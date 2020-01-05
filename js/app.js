'use strict';

// console.log('testing massage');

//  DATA FORMAT IN JSON FILE as below , array of object , to build a constroctor function 
/*
 "image_url": "http://3.bp.blogspot.com/_DBYF1AdFaHw/TE-f0cDQ24I/AAAAAAAACZg/l-FdTZ6M7z8/s1600/Unicorn_and_Narwhal_by_dinglehopper.jpg",
    "title": "UniWhal",
    "description": "A unicorn and a narwhal nuzzling their horns",
    "keyword": "narwhal",
    "horns": 1
*/

function Horns(data) {                                         // bulid constructor function 

  // constructor function properties 

  this.image_url = data.image_url;
  this.title = data.title;
  this.description = data.description;
  this.keyword = data.keyword;
  this.horns = data.horns;

  Horns.all.push(this);

} // end of HORNS constructor function 

Horns.all = [];                                                  // array to store all objects once created 

/******************************************************* Display Images - Page 1 ***********************************************/

Horns.prototype.render = function () {
  // console.log('hornobject : ', this.keyword);                // just for testing to check if I got data and access to the object

  let hornOut = $('<div></div');                                // make a div to put each object inside of it 
  hornOut.addClass(this.keyword);                               // create a class name for each object by using keyword properties 

  let template = $('#photo-template').html();                    // take all markup from html 

  hornOut.html(template);                                      // print markup then to html without values 

  hornOut.find('h2').text(this.title);                          // put title value in h2 
  hornOut.find('img').attr('src', this.image_url);                 // put image_url value in img 
  hornOut.find('p').text(this.description);                        // put description value in p 

  $('main').append(hornOut);                                      // print out values to the main 

}

$('#page1').on('click', function () {
  $('select').empty();                                                     // we need to clear option tag to add the 2nd page options
  $('select').html('<option value="default">Filter by Keyword</option>');  // after clearing what inside select tag which are options tag , we need to set up first option (filter by keyword)

  $('#photo-template').empty();                                   // clear the webpage to avoid the duplicates 
  Horns.all = [];                                                 // make sure the array of object also claer to avoid add dupliacted values to option tag 
  $.get('../data/page-1.json')                                   // get needed data from JSON file 
    .then(data =>                                                // what to do next use .THEN 
    {
      // console.log('data : ', data);                          // print out all objects (array of objects)
      data.forEach(hornobject => {                              // for loop to get every object in the array 
        // console.log('hornobject : ', hornobject);             // print out each object alone 
        let hhorn = new Horns(hornobject);                        // create new instance from constructor function 
        hhorn.render1();                                       // call render function using object since the function is a prototype function (part of constructor function)
      }); //end of Foreach 
    }) // end of .THEN
    .then(() => populateSelectBox());                             // to show up the selected keyword images (filtering)
}); // end of click function 

/******************************************************* Filter  Images ***********************************************/

/*   <option value="default">Filter by Keyword</option>    */

function populateSelectBox() {


  // Horns.all.sort((obj1,obj2) => {return obj1.title.toLowerCase() > obj2.title.toLowerCase()});       // tried to sort it but here I couldn't, ignore this line of code 

  let seen = [];                                                    // empty array to put unique keywords into it 
  let select = $('select');                                          // put the keywords in the select tag options so, add select and assign to variable
  Horns.all.forEach(horn =>                                       // for-loop for arrary of objects that we stored its into instructor array 
  {
    if (!(seen.includes(horn.keyword)))                           // check if keyword in the array , if not we do as below 
    {
      let option = `<option value="${horn.keyword}">${horn.keyword}</option>`    // add the keyword to dropdown menu 
      // console.log(' option : ', option);                                          // print out option 
      select.append(option);                                                      // append it to select tag (markup)
      seen.push(horn.keyword);                                                    // add keyword to this array if there's any repeated keywords will not added 
    } // end of if statement 
  }); // end of foreach 
  // console.log('seen Array of keywords  : ', seen );                             // print out seen array 
} // end of populateSelectBox function 


// Function to show up the images related to selected keywords 
$('select').on('change', function ()                                                // change event 
{
  let selectedkeyword = $(this).val();                                              // this is the selected keyword in the dropdown menu ,, val() JQuery build-in function to get the value of something 
  // console.log(' selectedkeyword: ', selectedkeyword);                               // print out the selected keyword 
  $('div').hide();                                                                  // hide all div and images 
  $(`.${selectedkeyword}`).fadeIn(1000);                                            // show all images related to the selected keywords , fadein() build-in JQuery function to show something slowly
}); // end of function 

/******************************************************* Display Images - Page 2 ***********************************************/

$('#page2').on('click', function () {
  $('select').empty();                                                     // we need to clear option tag to add the 2nd page options
  $('select').html('<option value="default">Filter by Keyword</option>');  // after clearing what inside select tag which are options tag , we need to set up first option (filter by keyword)
  $('#photo-template').empty();
  Horns.all = [];
  $.get('../data/page-2.json')
    .then(data => {
      data.forEach(hornobject => {
        let hhorn = new Horns(hornobject);
        hhorn.render1();
      });
    })
    .then(() => populateSelectBox());
});

// Handlebars for both page and we already invoked it on the click event for each page 
Horns.prototype.render1 = function () {                                                  // function to render page1 and page 2 by clicking 
  let  temp = $('#entry-template').html();                                             // get the handlebars template 
  // console.log('temp : ', temp);

  let tempCompile = Handlebars.compile(temp);                                           // compile the template and convert it to function 
  // console.log('tempCompile : ', tempCompile);

  let tempObj = tempCompile(this);                                                       // take the function and passes to it the object to fullfill the token template 
  // console.log('tempObj : ', tempObj);
  
  $('#photo-template').append(tempObj);                                                 // print it out on the page 
};// end of render1 function 


/**************************** Display Images Once page loaded and be sure if the page is ready **********************/

function showImages() {

  $('select').empty();                                                            // clear select options 
  $('select').html('<option value="default">Filter by Keyword</option>');         // add the intial option for select 
  $.get('../data/page-1.json')                                                    // get json file for page 1 
    .then(data =>                                                                   // takes the data 
    {
      data.forEach(hornobject => {                                                // looping for each object in the array 
        let hhorn = new Horns(hornobject);                                         // make a instance from constructor function
        hhorn.render1();                                                          // render it for each object after built it 
      });  // end of foreach loop
    })// end of .then
    .then(() => populateSelectBox());                                             // fullfill the select options 

}// end of showimages function 


$(document).ready(function () {                        // this fuction to make our page loaded successfully then do our code  
  showImages();                                      // as instructions we need to load page 1 images once webpage loaded 
}); // end of ready function 

/******************************************************* Sorting Images ***********************************************/


// Sorting By Title EventHandler 
$('#sortImages').on('click', function () {
  let sortedArr = [];                                                                                     // to add the sorted images to it then show it up 
  // Horns.all.sort((obj1, obj2) => { return obj1.title.toLowerCase() > obj2.title.toLowerCase() });         // sort the array of objects
   
  Horns.all.sort((obj1,obj2) => {return obj1.title < obj2.title ? -1 : 1;});

  // console.log('on sorted page  : ');
  // $('#photo-template').remove();                                                                     // remove() not working with sort so, be aware of that
  $('#photo-template').empty();                                                                          // clear homepage to render the images with sorting 

  let temp = $('#entry-template').html(); 
  let tempCompile = Handlebars.compile(temp); 

  Horns.all.forEach(horn =>
    {
      sortedArr.push(tempCompile(horn));
    });
  $('#photo-template').append(sortedArr);
  // console.log(' sortedArr by titlt : ', sortedArr );

});// end of click sort by title button


// Sorting By Number of Horns EventHandler 
$('#sortImagesH').on('click', function () 
{
  let sortedArrH = [];

  Horns.all.sort((obj1,obj2) => {return obj1.horns < obj2.horns ? -1 : 1;});

  $('#photo-template').empty(); 

  let temp = $('#entry-template').html(); 
  let tempCompile = Handlebars.compile(temp); 

  Horns.all.forEach(horn =>
    {
      sortedArrH.push(tempCompile(horn));
      // console.log('horn.horns : ', horn.horns);
    });
  $('#photo-template').append(sortedArrH);

  // console.log(' sortedArrH by number of horns : ', sortedArrH );
}); // end of click sort by number of horns button