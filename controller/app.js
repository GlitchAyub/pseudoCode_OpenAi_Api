
const express = require('express')
const { Configuration, OpenAIApi } = require ('openai')
const app = express()
require('dotenv').config()


// middleware
app.use(express.json())

// openai config
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)


// empty array to store in below function generateResponse
const converstionContext = [];
const currentMessage = [];

// funtion to handle chat conversation in post menthod
const generateResponse = async (req , res )=>{
  try {
    const {prompt} = req.body;
    const modelId ="gpt-3.5-turbo";
    const promtText = `${prompt} \n \nResponse: `;

    // restore the prev context

    for(const [inputText,responseText] of converstionContext){
      currentMessage.push({role:"user",content:inputText})
      currentMessage.push({role:"assistant",content:responseText})
    }
    // store the new message
    currentMessage.push({role:'user',content:promtText})

    const result = await openai.createChatCompletion({
      model:modelId,
      messages:currentMessage,
    })

    const responseText = result.data.choices.shift().message.content;
    converstionContext.push([promtText,responseText]);
    res.send({response:responseText})
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal server error"})
  }
}



//function to get  book details
const getBookContent =async(book)=>{
  let data = [
    {role:"assistant",content:"Let me tell you ..!"},
    {role:"user",content:`get me content of ${book.title}`}
  ];
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: data,
    });
    const answer = response.data.choices[0].message.content;
    console.log(answer);
    return answer;
  }catch(e){
    console.log('Please check the data or upgrade an openAI account',e);
    return null;
  }
}
//function to get summary and bookname
const getBookTag=async(summary,bookname)=>{
const taggingPrompt = `content : ${summary} book : ${bookname}`
 let data = [
  {role:"assistant",content:"Let me tell you ..!"},
  {role:"user",content:taggingPrompt}
 ]

 try {
  const response = await openai.createChatCompletion({
    model:'gpt-3.5-turbo',
    messages: data
  });
  const answer = response.data.choices[0].message.content
  console.log(answer);
  return answer

 } catch (e) {
  console.log('Please check the data or upgrade an openAI account',e);
  return null;
 }
}


  //function to get concise explanation 
  const getConciseExplanation= async(explanations) =>{
    let data = [
      {role:"assistant",content:"Let me tell you ..!"},
      {role:"user",content:`compare all and explain ${explanations}`}
    ]
    try {
      const response =  await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages:data
      });
      const answer = response.data.choices[0].message.content
      return answer;
    } catch (e) {
      console.log('Please check the data or upgrade an openAI account',e);
      return null;
    }
  }


//////////////////////////////////////////////////////////////

//  main function
const getAlLBooksSummaries = async(data)=>{
  let books = JSON.parse(JSON.stringify(data));
  let allTags = [];
  for(let i =0;i<books.length;i++){

    let {author,...book}=books[i];
    book.author = author
  
    let summary =await getBookContent(book)
    books[i].content = summary; 
    console.log(summary);
    
    let bookName = book.title
    let tags =await getBookTag(summary,bookName)
    books[i].tags = tags
    allTags.push(tags);
  }
  // console.log(allTags); 
  

  const combine =await getConciseExplanation(allTags)
  console.log(combine);

}

// export
module.exports= generateResponse;
module.exports = getAlLBooksSummaries;



