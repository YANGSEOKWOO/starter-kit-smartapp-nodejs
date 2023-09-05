const SmartApp = require('@smartthings/smartapp');

async function handleContactSensor(ctx, eventData, eventTime) {
    console.log('handleContactSensor() is called...');
    console.log('ctx.config.camera',ctx.config.camera)
}

async function handleMotionSensor(ctx, eventData, eventTime) {
    console.log('motion oN')
    console.log('ctx.config.camera', ctx.config.camera)
    ctx.api.devices.sendCommands(ctx.config.camera, 'switch', 'off')
}

async function handleButton(ctx, eventData, eventTime) {
    console.log('handleButton() is called...');

}
// async function handleVideoSensor(ctx, eventData, eventTime){
    
// }

module.exports = new SmartApp()
    .configureI18n()
    .enableEventLogging(2) // logs all lifecycle event requests/responses as pretty-printed JSON. Omit in production
    .page('mainPage', (context, page, configData) => {
        page.section('Starter kit', section => {
            // https://www.samsung.com/sec/smartthings/HOMEKITA/HOMEKITA/

            // (1) https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference#contactSensor
            section.deviceSetting('contactSensor')
                .capabilities(['contactSensor'])
                .permissions('r')
                .required(true);

            // (2) https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference#motionSensor
            section.deviceSetting('camera')
                .capabilities(['videoCapture','switch'])
                .permissions('rx')
                .required(true);     
                
            // (3) https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference#button
            section.deviceSetting('smartButton')
                .capabilities(['button'])
                .permissions('r')
                .required(true);
            // section.deviceSetting('camera')
            //     .capabilities(['videoCapture'])
            //     .permissions('r')                
            //     .required(false);
        });
    })
    .updated(async (context, updateData) => {
        await context.api.subscriptions.delete();
        await context.api.subscriptions.subscribeToDevices
            (context.config.contactSensor,
                'contactSensor', 'contact', 'contactSensorHandler');
        await context.api.subscriptions.subscribeToDevices
            (context.config.camera,
                'motionSensor', 'motion', 'motionSensorHandler');
        await context.api.subscriptions.subscribeToDevices
            (context.config.smartButton,
                'button', 'button', 'buttonHandler');
               
    })
    .subscribedEventHandler('contactSensorHandler', handleContactSensor)
    .subscribedEventHandler('motionSensorHandler', handleMotionSensor)
    .subscribedEventHandler('buttonHandler', handleButton)

