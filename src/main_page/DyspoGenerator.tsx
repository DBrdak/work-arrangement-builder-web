import {FormControl, InputLabel, MenuItem, Select, Stack, useMediaQuery} from "@mui/material";
import {Form, Formik} from "formik";
import Month from "../models/month";
import SpreadsheetFactory from "../models/spreadSheetFactory";
import theme from "../theme";
import CalendarView from "../components/CalendarView";
import {useState} from "react";
import DownloadButton from "../components/DownloadButton";
import {useStore} from "../stores/store";
import {observer} from "mobx-react-lite";

export default observer( function  DyspoGenerator() {
    const {commonStore  } = useStore()
    const {selectedSpot} = commonStore
    const [eventDays, setEventDays] = useState<number[]>([])
    const [closedDays, setClosedDays] = useState<number[]>([])
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const initValues = {
        month: Month.nextMonth().value,
    }
    const color = selectedSpot === 'D81' ? 'primary' : 'secondary'
    const hexcolor = selectedSpot === 'D81' ? 'rgba(255,200,9,0.5)' : 'rgba(241,159,196,0.5)'

    async function handleFormSubmit(values: {month: string}) {
        const factory = new SpreadsheetFactory(
            selectedSpot,
            Month.fromValue(values.month),
            eventDays.map(day => day),
            closedDays.map(day => day),
            commonStore.settings
        )

        await factory.createAndDownloadSpreadsheet()
    }

    function handleClosedClick(closedDayIndex: number) {
        if(!eventDays.some(d => d === closedDayIndex) && !closedDays.some(d => d === closedDayIndex)){
            setClosedDays([...closedDays, closedDayIndex])
        } else if (closedDays.some(d => d === closedDayIndex)) {
            setClosedDays(closedDays.filter(d => d !== closedDayIndex))
        } else if(eventDays.some(d => d === closedDayIndex)) {
            setEventDays(eventDays.filter(d => d !== closedDayIndex))
            setClosedDays([...closedDays, closedDayIndex])
        }
    }

    function handleEventClick(eventDayIndex: number) {
        if(!eventDays.some(d => d === eventDayIndex) && !closedDays.some(d => d === eventDayIndex)){
            setEventDays([...eventDays, eventDayIndex])
        } else if (eventDays.some(d => d === eventDayIndex)) {
            setEventDays(eventDays.filter(d => d !== eventDayIndex))
        }else if(closedDays.some(d => d === eventDayIndex)) {
            setClosedDays(closedDays.filter(d => d !== eventDayIndex))
            setEventDays([...eventDays, eventDayIndex])
        }
    }

    return (
        <Formik
            initialValues={initValues}
            onSubmit={async (values) => await handleFormSubmit(values)}
            validateOnMount={true}>
            {({handleSubmit, handleChange, values}) => (
                <Form style={{width: '100%'}} onSubmit={handleSubmit} autoComplete='off'>
                    <Stack direction={'column'} spacing={5}
                           style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {selectedSpot.length > 0 &&
                            <FormControl style={{minWidth: '50%', maxWidth: '75%'}} color={color}>
                                <InputLabel>Miesiąc</InputLabel>
                                <Select
                                    style={{textAlign: 'center'}}
                                    color={color}
                                    id={'month'}
                                    name={'month'}
                                    value={values.month}
                                    label="Miesiąc"
                                    onChange={(event) => {
                                        setClosedDays([])
                                        setEventDays([])
                                        handleChange(event)
                                    }}
                                >
                                    {Month.All.map(m =>
                                        <MenuItem key={m.id} value={m.value} style={{
                                            backgroundColor: m.value === values.month ? hexcolor : 'inherit',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {m.value}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        }
                        {values.month && selectedSpot && !isMobile &&
                            <>
                                <CalendarView
                                    month={Month.fromValue(values.month)}
                                    eventDays={eventDays}
                                    closedDays={closedDays}
                                    onEventDayClick={(x) => handleEventClick(x)}
                                    onClosedDayClick={(x) => handleClosedClick(x)}
                                    color={color} />
                                <DownloadButton disabled={!(selectedSpot && values.month)} color={color} handleClick={handleSubmit} reset={() => handleChange} />
                            </>
                        }
                    </Stack>
                </Form>
            )}
        </Formik>
    );
})