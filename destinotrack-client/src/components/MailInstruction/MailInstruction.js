import { Typography } from 'antd';
import React from 'react'

const { Text } = Typography;

export default function MailInstruction() {
  return (
    <section>
        <Text>To get your app-password:</Text>
        <ul>
            <li><Text>Create an account/login in <a target="_blank" href='https://onboarding.brevo.com/account/register'>Brevo</a></Text></li>
            <li><Text>Go to this page <a target="_blank" href='https://app.brevo.com/settings/keys/smtp'>SMTP & API</a></Text></li>
            <li><Text>Copy and paste the SMTP key value from 'Your SMTP keys' section</Text></li>
        </ul>
    </section>
  )
}
