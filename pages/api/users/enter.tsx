import twilio from "twilio";
import smtpTransport from "@libs/server/email";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandlers";
import client from "@libs/server/client";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, phone } = req.body;
  const user = email ? { email } : phone ? { phone: +phone } : null;
  if (!user) return res.status(400).json({ ok: false });

  const payload = `${Math.floor(100000 + Math.random() * 900000)}`;
  const token = await client.token.create({
    data: {
      payload,
      user: {
        // 토큰 생성시 user도 새로 생성하려면 create
        // 존재하는 user 객체와 연결한다면 connect
        // user 있으면 connect, 없으면 생성하려면 connectOrCreate
        // connect: {
        //   id: user.id,
        // },
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.TEST_PHONE!,
      body: `Your login token is ${payload}`,
    });
    console.log(message);
  } else if (email) {
    const mailOptions = {
      from: `${process.env.MAIL_ID}@naver.com`,
      to: email,
      subject: "Nomad Carrot Authentication Email",
      text: `Authentication Code : ${payload}`,
    };
    smtpTransport.sendMail(mailOptions, (error, responses) => {
      if (error) {
        console.log("error", error);
        return;
      }
      console.log("responses", responses);
      return;
    });
    smtpTransport.close();
  }
  res.json({
    ok: true,
  });
}

// NextJS에서 api를 실행시키려면 반드시 함수를 반환해야함 (withHandler 내부 구현을 보면 function을 반환하고 있음)
export default withHandler("POST", handler);
