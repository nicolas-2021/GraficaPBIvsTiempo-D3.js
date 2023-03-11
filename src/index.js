import './index.css';
let w = 1500;
let h = 500;
let padding = 50;
let json; 
const req = new XMLHttpRequest();
req.addEventListener('load', (datos) =>{
 console.log('datos recibidos');
 json = JSON.parse(datos.target.response);
 console.log(json);
 showBar();
//document.getElementsByClassName('mensaje')[0].innerHTML=JSON.stringify(json.data);
});
req.addEventListener('error', ()=>{
    console.log('error');
    document.getElementsByClassName('mensaje')[0].innerHTML='Error';
});

req.open('GET','https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);

req.send();
console.log('req enviado');

function showBar(){
    let svg = d3.select('#sVG')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

    svg.append('text')
    .attr('x',500)
    .attr('y', 250)
    .attr('class', 'titulo')
    .text('Historia PBI');

    let dataSet = json.data;
    let fechas = dataSet.map(function(item){
        return new Date(item[0]);
    });

    let Max = d3.max(fechas);
    let Min = d3.min(fechas);
    let Xscale = d3.scaleTime()
    .domain([Min,Max])
    .range([padding, w-padding]);
    const xAxis = d3.axisBottom(Xscale);

    svg.append('g')
    .attr('transform', 'translate('+0+','+(h-padding)+')')
    .call(xAxis);

    let maxPBI = d3.max(dataSet,(d)=> d[1]);
    let Yscale = d3.scaleLinear()
    .domain([0,maxPBI])
    .range([h-padding, padding]);
    const yAxis = d3.axisLeft(Yscale);

    svg.append('g')
    .attr('transform', 'translate('+padding+',0)')
    .call(yAxis);

    dataSet.sort((a, b) => new Date(a.fechas).getTime() > new Date(b.fechas).getTime());
    

    svg.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('x', (d,i)=>{
        return (Xscale(fechas[i]))
    })
    .attr('y', (d)=>{
        return Yscale(d[1])
    })
    .attr('width', 3)
    .attr('height',(d)=>(h-padding) - Yscale(d[1]))
    .attr('fill', 'yellow')
    .attr('class', 'bar')
    .on('mouseover',function(d,i){
        d3.select(this)
        .append('title')
        .text(dataSet[dataSet.indexOf(i)][0]+' PBI:'+dataSet[dataSet.indexOf(i)][1]);
    });
}
