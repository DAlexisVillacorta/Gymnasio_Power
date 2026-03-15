export interface ScheduleAppointmentDTO {
    date: string
    time: string
    userId: number
    service: {
        name: string
        instructor: string
        duration: string
    }
}
