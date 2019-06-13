export default async function postFeedback(feedback, user) {
  // prepare confirmation email
  let emailBody;
  await fetch("emailTemplates/Feedback.html")
    .then(response => response.text())
    .then(text => (emailBody = String.format(text, feedback.body)));

  // build sendgrid load
  const sendgridLoad = JSON.stringify({
    to: "paul.marks@pittsburghpa.gov",
    from: {
      email: user,
      name: "PGH Works"
    },
    subject: "Feedback from PGH Works",
    html: emailBody
  });

  // and post
  fetch("https://sendgridproxy.azurewebsites.us/sendMail/single", {
    method: "POST",
    body: sendgridLoad,
    headers: new Headers({
      Authorization: "Bearer 6df4c73d-71f1-478d-ba2d-63f62e4de251",
      "Content-type": "application/json"
    })
  });
}

// string formatting
declare module String {
  export var format: any;
}

String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    s = s.replace(reg, arguments[i + 1]);
  }
  return s;
};
