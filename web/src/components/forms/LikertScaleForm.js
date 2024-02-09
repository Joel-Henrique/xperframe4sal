import Likert from 'react-likert-scale'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({

    root: {
      maxWidth: '80%',
      marginBottom: 16,
      boxShadow: "0 10px 20px 0 rgba(0,0,0,0.25)"
    }

  })

const LikertScaleForm  = (props) => {

    const classes = useStyles()

    const likertOptions = {

        responses: props.options,
        onChange: val => {
            props.onChange(props.question, Object.values(val)[1])
        }

    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.question}
                </Typography>
                <Likert {...likertOptions} />
            </CardContent>
        </Card>
    )
    
}

export { LikertScaleForm }