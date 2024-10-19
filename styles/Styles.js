
export const PALETTE = {
    "primary" : "#036E74",
    "secondary" : "#C52153",
    "tertiary" : "#A9A9A9",
    "white" : "#FFFFFF",
	"success" : "#21CB88",
	"error" : "#FF0000",
}


export const fontStyle = {
	big : 20,
	lessBig : 18,
	medium : 16,
	small : 12,
}

export const containerStyles = {
	parameterContainer : {
		width : "100%",
		height : 50,
		backgroundColor : PALETTE.primary,
		justifyContent : "flex-start",
		alignItems : "center",
		marginBottom : "5%",
	},
	parametersContainer : {
		flex : 1,
		width : "100%",
		justifyContent : "center",
		alignItems : "center",
		backgroundColor : PALETTE.primary,
		padding : "5%",
	},
	commandeContainer : {
		width:"100%",
		height: 100,
		backgroundColor: PALETTE.white,
		marginBottom: "5%",
		padding:"5%",
		borderRadius: 10,
	
	},
	clientContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
        backgroundColor : PALETTE.primary,
	},
	cakeContainer:{
		margin:"10%",
		flexDirection:"row",
		justifyContent:"space-around",
		alignItems:"center",
		width:"100%",
		marginBottom:"5%",
	},
	cake:{
		width:100,
		height:100,
		borderRadius:10,
	},

    mainContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
        backgroundColor : PALETTE.primary,
    },
    headerContainer : {
        backgroundColor : PALETTE.primary,
		paddingBottom:"5%",
        paddingTop:  "15%",
		flexDirection:"row-reverse",
		justifyContent:"space-between",
		alignItems:"center"
	},
    scrollViewContainer:{
		backgroundColor: PALETTE.white,
		marginBottom:"20%",
	},
    drawerContainer:{
		flex: 1,
		flexDirection:"column",
		backgroundColor: PALETTE.white,
	},
    lineContainer:{
		width:"100%",
		height:1,
		backgroundColor:PALETTE.white,
	},
	drawerImageContainer : {
		width: "100%",
		height: "30%",
		alignItems: 'center',
		justifyContent:	'center',
		marginBottom: "-15%",
	},
	drawerImage : {
		width: "60%",
		height: "60%",
		marginBottom: "15%",
		borderRadius:5
	},
	lottieContainer:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputContainer:{
		padding:"2%",
		borderRadius:5,
		width:"80%",
		marginBottom:"5%",
		borderWidth:1,
		borderColor:PALETTE.white,
		color:PALETTE.white,
	},
	commandeContainer: {
        width: "90%",
		alignSelf:"center",
        backgroundColor: PALETTE.white,
        marginBottom: "5%",
        padding: "5%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PALETTE.tertiary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: PALETTE.primary,
        padding: "5%",
    },
    orderDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "3%",
    },
    button: {
        marginTop: "5%",
        padding: "3%",
        backgroundColor: PALETTE.primary,
        borderRadius: 5,
        alignItems: "center",
    },
}

export const textStyles = {
	parameterText: {
		fontSize: fontStyle.medium,
		color: PALETTE.white,
		fontWeight: "bold",
		textAlign: "flex-start",
	},
	clientName: {
        fontSize: fontStyle.lessBig,
        fontWeight: "bold",
        color: PALETTE.primary,
        marginBottom: "2%",
    },
    clientAddress: {
        fontSize: fontStyle.medium,
        color: PALETTE.tertiary,
    },
    buttonText: {
        fontSize: fontStyle.medium,
        color: PALETTE.white,
        fontWeight: "600",
    },
	cakeNumber: {
		fontSize: fontStyle.big,
		fontWeight: "bold",
		color: PALETTE.white,
		textAlign: "center",
		marginTop: "5%",
		borderBottomWidth: 1,
		borderColor: PALETTE.white,
		width:"65%",
		alignSelf:"center",
	},
	title:{
		width:"100%",
		fontSize:fontStyle.big + 10,
		fontWeight:"bold",
		color:PALETTE.white,
		marginBottom:"10%",
		textAlign:"center",
	},
    headerText : {
        marginLeft : "-10%",
        color : PALETTE.white,
        fontSize : fontStyle.big,
        fontWeight : "bold",
        textAlign : "center",
        flex: 1,
    },
    drawerText : {
		fontWeight: "600",
		fontSize: fontStyle.medium,
		color: PALETTE.primary,
		textAlign: 'left',
    },
	primaryText : {
		fontWeight: "600",
		fontSize: fontStyle.medium,
		color: PALETTE.white,
		textAlign: 'center',
	},
	secondaryText : {
		fontWeight: "600",
		fontSize: fontStyle.medium,
		color: PALETTE.primary,
		textAlign: 'center',
	},
}

export const buttonStyles = {
	drawerButton : {
		width:"100%",
		height: 60,
		backgroundColor: PALETTE.white,
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingLeft:"7%",
	},
	primaryButton : {
		marginBottom:"5%",
		width:"80%",
		height: 60,
		borderRadius: 10,
		backgroundColor: PALETTE.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryButton : {
		width:"80%",
		height: 60,
		borderRadius: 10,
		backgroundColor: PALETTE.primary,
		borderWidth: 1,
		borderColor: PALETTE.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
}

