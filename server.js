const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Inventory',(err,database)=>
{
    if(err) return console.log(err)
    db=database.db('Inventory')
    app.listen(5000,() =>
    {
        console.log('Listening at port number 5000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.get('/',(req,res) =>
{
    db.collection('furniture').find().toArray((err,result)=>
    {
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})
app.get('/create',(req,res)=>{
    res.render('addProduct.ejs')
})
app.get('/update',(req,res)=>{
    res.render('updateStock.ejs')
})
app.get('/remove',(req,res)=>{
    res.render('removeProduct.ejs')
})



app.post('/AddData', (req,res) =>{
    db.collection('furniture').save(req.body, (err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    },{sort: {_pid:-1}})
})

app.post('/UpdateStock', (req,res)=> {

    db.collection('furniture').find().toArray((err, result)=> {
        if(err)
            return console.log(err)


        for(var i=0; i<result.length; i++)
        {
            if(result[i].pid==req.body.id)
            {
                s=result[i].pstock
                break;
            }
        }
        db.collection('furniture').findOneAndUpdate({pid: req.body.id}, {
            $set: {pstock: parseInt(s) + parseInt(req.body.stock)}} ,
            (err, result)=> {
                if(err)
                    return res.send(err)
                console.log(req.body.id+' stock updated')
                res.redirect('/')
            })
        })
})


app.post('/RemoveStock', (req,res)=> {

    db.collection('furniture').find().toArray((err, result)=> {
        if(err)
            return console.log(err)
        for(var i=0; i<result.length; i++)
        {
            if(result[i].pid==req.body.id)
            {
                s=result[i].pstock
                break;
            }
        }
        db.collection('furniture').findOneAndUpdate({pid: req.body.id}, {
            $set: {pstock: parseInt(s) - parseInt(req.body.stock)}
        } ,
            (err, result)=> {
                if(err)
                    return res.send(err)
                console.log(req.body.id+' stock updated')
                res.redirect('/')
            })
        })
})


app.post('/RemoveProduct', (req,res)=> {
    db.collection('furniture').findOneAndDelete({pid: req.body.id}, (err, result)=> {
        if(err)
            return console.log(err)
        res.redirect('/')
    })
})