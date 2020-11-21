import React,{ useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Svg from 'react-native-svg';

export default function Clock(props) {
  const [layout,setLayout]=useState({})
  const minutes = props.date.getMinutes()
  const hours = props.date.getHours() % 12
  const centerX = layout.width/2
  const centerY = layout.height/2
  const textRadius = layout.width/2-20
  const tickRadiusInner = layout.width/2-40
  const tickRadiusOuter = layout.width/2-35
  const minuteHandRadius = tickRadiusInner - 10
  const hourHandRadius = 50
  const showFace = layout.width && layout.height
  const angleMinutes = 1.5*Math.PI+2*Math.PI*minutes/60
  const minutesX = centerX+minuteHandRadius*Math.cos(angleMinutes)
  const minutesY = centerY+minuteHandRadius*Math.sin(angleMinutes)
  const angleHours = 1.5*Math.PI+2*Math.PI*(hours+minutes/60)/12
  const hoursX = centerX+hourHandRadius*Math.cos(angleHours)
  const hoursY = centerY+hourHandRadius*Math.sin(angleHours)
  const clockHands = showFace ?
        <>
          <Svg.Circle cx={centerX} cy={centerY} r={6} fill="black"/>
          <Svg.Line x1={centerX} y1={centerY} x2={minutesX} y2={minutesY} stroke="black" strokeWidth={3}/>
          <Svg.Line x1={centerX} y1={centerY} x2={hoursX} y2={hoursY} stroke="black" strokeWidth={6}/>
        </>: null


  const clockNumbers = showFace ?
        [1,2,3,4,5,6,7,8,9,10,11,12].map((i)=> {
          let angleRadians = Math.PI- 2*Math.PI*i/12
          let textX = centerX+textRadius*Math.sin(angleRadians)
          let textY = centerY+textRadius*Math.cos(angleRadians)
          return (
            <View key={i} style={[styles.numberView,{left:textX,top:textY}]}>
              <Text style={[styles.numberText]}>{i}</Text>
            </View>);
        })
        : null

  const clockTicks = showFace ?
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59].map(
          (i) => {
            let angleRadians = 2*Math.PI * i/60
            let x1 = centerX+tickRadiusInner*Math.sin(angleRadians)
            let y1 = centerY+tickRadiusInner*Math.cos(angleRadians)
            let x2 = centerX+tickRadiusOuter*Math.sin(angleRadians)
            let y2 = centerY+tickRadiusOuter*Math.cos(angleRadians)
            let bold = (i%5)===0
            return <Svg.Line stroke="black" key={i} strokeWidth={bold?2:1} x1={x1} y1={y1} x2={x2} y2={y2}/>
          })
        : null
  return (
    <View style={styles.container} onLayout={(e)=>{setLayout(e.nativeEvent.layout)}}>
      {clockNumbers}
      <Svg.Svg>
        {clockHands}
        {clockTicks}
      </Svg.Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:"50%",
    width:"90%",
  },
  numberView:{
    position:"absolute"
  },
  numberText: {
    position:"relative",
    top:"-50%",
    left:"-50%",
    fontSize:14,
    fontWeight:"bold"
  }
})
