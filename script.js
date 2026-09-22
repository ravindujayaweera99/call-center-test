(function(){
"use strict";

/* ============================ MOCK DATA ============================ */

const hospitals = [
  {code:"HSP-001", name:"Asiri Central Hospital", district:"Colombo", tel:"011-2 665 500", cashless:true, status:"Active"},
  {code:"HSP-002", name:"Nawaloka Hospital", district:"Colombo", tel:"011-2 544 444", cashless:true, status:"Active"},
  {code:"HSP-003", name:"Lanka Hospitals", district:"Colombo", tel:"011-5 430 000", cashless:true, status:"Active"},
  {code:"HSP-004", name:"Durdans Hospital", district:"Colombo", tel:"011-2 140 000", cashless:true, status:"Active"},
  {code:"HSP-005", name:"Hemas Hospital Wattala", district:"Gampaha", tel:"011-7 888 888", cashless:true, status:"Active"},
  {code:"HSP-006", name:"Hemas Hospital Thalawathugoda", district:"Colombo", tel:"011-7 888 000", cashless:true, status:"Active"},
  {code:"HSP-007", name:"Ninewells Hospital", district:"Colombo", tel:"011-4 202 020", cashless:true, status:"Active"},
  {code:"HSP-008", name:"Kandy General (Private Wing)", district:"Kandy", tel:"081-2 222 261", cashless:false, status:"Under review"},
  {code:"HSP-009", name:"Softlogic Care Ward", district:"Colombo", tel:"011-4 313 131", cashless:true, status:"Active"},
  {code:"HSP-010", name:"Golden Key Hospital", district:"Galle", tel:"091-2 222 500", cashless:true, status:"Active"},
];

const coordinators = [
  {name:"N. Wickramasinghe", emp:"CC-1042", hospitals:["Asiri Central Hospital","Nawaloka Hospital"], shift:"08:00–17:00", contact:"077-2 130 442", status:"on", backup:"S. Jayawardena"},
  {name:"S. Jayawardena", emp:"CC-1043", hospitals:["Lanka Hospitals","Durdans Hospital"], shift:"08:00–17:00", contact:"071-4 552 019", status:"on", backup:"N. Wickramasinghe"},
  {name:"A. Fernando", emp:"CC-1044", hospitals:["Hemas Hospital Wattala","Hemas Hospital Thalawathugoda"], shift:"14:00–23:00", contact:"076-9 001 233", status:"off", backup:"R. Silva"},
  {name:"R. Silva", emp:"CC-1045", hospitals:["Ninewells Hospital","Softlogic Care Ward"], shift:"08:00–17:00", contact:"070-2 445 981", status:"leave", backup:"A. Fernando"},
  {name:"D. Perera", emp:"CC-1046", hospitals:["Golden Key Hospital"], shift:"08:00–17:00", contact:"075-8 812 004", status:"on", backup:"N. Wickramasinghe"},
];

const policies = [
  {
    policyNo:"POL-HEM-0231", company:"Hemas Holdings PLC", start:"2025-04-01", periodEnd:"2027-03-31", status:"Active",
    sales:"K. Abeywardena · 011-2 300 981", hr:"P. Ranatunga (HR) · 011-2 300 700",
    benefits:[{name:"Hospitalization (Cashless)", limit:"Rs. 2,500,000 / member / year", used:"Rs. 340,000"},
              {name:"Reimbursement – Indoor", limit:"Rs. 750,000 / member / year", used:"Rs. 0"},
              {name:"OPD", limit:"Rs. 60,000 / member / year", used:"Rs. 12,500"}],
    members:[
      {no:"MEM-88213", name:"S. Kumari Fernando", nic:"199045701234", rel:"Principal", dob:"1990-04-08", effective:"2025-04-01"},
      {no:"MEM-88214", name:"T. Nuwan Fernando", nic:"199212301122", rel:"Spouse", dob:"1992-12-07", effective:"2025-04-01"},
      {no:"MEM-88215", name:"Amaya Fernando", nic:"Minor", rel:"Child", dob:"2018-06-14", effective:"2025-04-01"},
    ]
  },
  {
    policyNo:"POL-DLG-1042", company:"Dialog Axiata PLC", start:"2025-08-01", periodEnd:"2027-07-31", status:"Active",
    sales:"H. Mendis · 011-2 456 210", hr:"C. Rodrigo (HR) · 011-2 456 000",
    benefits:[{name:"Hospitalization (Cashless)", limit:"Rs. 3,000,000 / member / year", used:"Rs. 0"},
              {name:"Reimbursement – Indoor", limit:"Rs. 900,000 / member / year", used:"Rs. 84,200"},
              {name:"OPD", limit:"Rs. 75,000 / member / year", used:"Rs. 22,000"}],
    members:[
      {no:"MEM-51042", name:"M. Priyantha Fernando", nic:"198712456778", rel:"Principal", dob:"1987-12-19", effective:"2025-08-01"},
      {no:"MEM-51043", name:"J. Dilrukshi Fernando", nic:"199003215544", rel:"Spouse", dob:"1990-03-02", effective:"2025-08-01"},
    ]
  },
  {
    policyNo:"POL-JKH-0099", company:"John Keells Holdings PLC", start:"2024-01-01", periodEnd:"2026-12-31", status:"Active",
    sales:"W. Gunawardena · 011-2 306 400", hr:"L. Peiris (HR) · 011-2 306 100",
    benefits:[{name:"Hospitalization (Cashless)", limit:"Rs. 4,000,000 / member / year", used:"Rs. 1,125,000"},
              {name:"Reimbursement – Indoor", limit:"Rs. 1,000,000 / member / year", used:"Rs. 0"},
              {name:"OPD", limit:"Rs. 90,000 / member / year", used:"Rs. 41,000"}],
    members:[
      {no:"MEM-30187", name:"R. Chandima Perera", nic:"197509876543", rel:"Principal", dob:"1975-09-11", effective:"2024-01-01"},
      {no:"MEM-30188", name:"N. Ishara Perera", nic:"200105123321", rel:"Child", dob:"2001-05-20", effective:"2024-01-01"},
    ]
  }
];

const stages = ["Claim Intimated","Registered","Coordinator Assigned","Cashless Approval Pending","Approved","Hospitalization","Discharge Intimation","Final Bill Received","Claim Processing","Settled"];

let claims = [
  {
    ref:"CSH-2026-00842", type:"Cashless", policyNo:"POL-HEM-0231", member:"S. Kumari Fernando", memberNo:"MEM-88213",
    hospital:"Asiri Central Hospital", admDate:"2026-09-20", admTime:"14:20", diagnosis:"Acute appendicitis", amount:"Rs. 150,000",
    coordinator:"N. Wickramasinghe", stageIdx:5, status:"Hospitalization", caller:"T. Nuwan Fernando (Spouse)", callerContact:"077-6 654 321",
    updated:"20 Sep, 14:32"
  },
  {
    ref:"CSH-2026-00839", type:"Cashless", policyNo:"POL-JKH-0099", member:"R. Chandima Perera", memberNo:"MEM-30187",
    hospital:"Lanka Hospitals", admDate:"2026-09-18", admTime:"09:05", diagnosis:"Cardiac evaluation & angiogram", amount:"Rs. 150,000",
    coordinator:"S. Jayawardena", stageIdx:9, status:"Settled", caller:"R. Chandima Perera (Self)", callerContact:"071-2 209 887",
    updated:"21 Sep, 11:10",
    discharge:{date:"2026-09-19", time:"16:40", finalDiag:"Coronary angiogram – no intervention required", finalAmount:"Rs. 1,125,000", approvedAmount:"Rs. 1,125,000", extra:"Rs. 0"}
  },
  {
    ref:"CSH-2026-00845", type:"Cashless", policyNo:"POL-DLG-1042", member:"M. Priyantha Fernando", memberNo:"MEM-51042",
    hospital:"Hemas Hospital Wattala", admDate:"2026-09-21", admTime:"07:50", diagnosis:"Elective knee arthroscopy", amount:"Rs. 150,000",
    coordinator:"A. Fernando", stageIdx:3, status:"Cashless Approval Pending", caller:"J. Dilrukshi Fernando (Spouse)", callerContact:"076-3 340 221",
    updated:"21 Sep, 08:15"
  },
  {
    ref:"RMB-2026-01221", type:"Reimbursement", policyNo:"POL-JKH-0099", member:"N. Ishara Perera", memberNo:"MEM-30188",
    hospital:"Golden Key Hospital", admDate:"2026-09-15", diagnosis:"OPD consultation & lab investigations", claimKind:"OPD",
    caller:"R. Chandima Perera (Parent)", callerContact:"071-2 209 887", status:"Documents pending", updated:"20 Sep, 16:02"
  },
  {
    ref:"CSH-2026-00851", type:"Cashless", policyNo:"POL-HEM-0231", member:"T. Nuwan Fernando", memberNo:"MEM-88214",
    hospital:"Nawaloka Hospital", admDate:"2026-09-22", admTime:"06:40", diagnosis:"Road traffic accident – fracture assessment", amount:"Rs. 150,000",
    coordinator:"N. Wickramasinghe", stageIdx:2, status:"Coordinator Assigned", caller:"S. Kumari Fernando (Spouse)", callerContact:"077-6 654 321",
    updated:"22 Sep, 07:02"
  },
  {
    ref:"CSH-2026-00848", type:"Cashless", policyNo:"POL-DLG-1042", member:"J. Dilrukshi Fernando", memberNo:"MEM-51043",
    hospital:"Durdans Hospital", admDate:"2026-09-19", admTime:"19:15", diagnosis:"Maternity – normal delivery", amount:"Rs. 150,000",
    coordinator:"S. Jayawardena", stageIdx:6, status:"Discharge Intimation", caller:"M. Priyantha Fernando (Spouse)", callerContact:"076-3 340 221",
    updated:"21 Sep, 09:44"
  },
];

let approvals = [
  {ref:"CSH-2026-00845", member:"M. Priyantha Fernando", hospital:"Hemas Hospital Wattala", restriction:"Elective procedure within 90-day waiting period for existing condition",
   requestedBy:"R. Perera", officer:"Senior Manager – SHE & PA Claims", status:"Pending", remark:"Member reports acute limitation; requesting exception review."},
  {ref:"CSH-2026-00799", member:"A. Silva", hospital:"Ninewells Hospital", restriction:"Dependent added after admission date",
   requestedBy:"M. Jayasuriya", officer:"AGM – Non-Motor Claims", status:"Approved", remark:"Verified HR effective-date correction; approved for Rs. 480,000.", decidedAmount:"Rs. 480,000"},
  {ref:"CSH-2026-00781", member:"K. Bandara", hospital:"Softlogic Care Ward", restriction:"Diagnosis falls under 12-month exclusion list",
   requestedBy:"R. Perera", officer:"CO – GI", status:"Declined", remark:"Confirmed exclusion applies per policy schedule C."},
];

let callLog = [
  {dt:"22 Sep, 07:02", ref:"CSH-2026-00851", caller:"S. Kumari Fernando", officer:"R. Perera", purpose:"Cashless intimation", outcome:"Registered — coordinator assigned"},
  {dt:"21 Sep, 11:10", ref:"CSH-2026-00839", caller:"R. Chandima Perera", officer:"D. Perera", purpose:"Settlement query", outcome:"Confirmed settled amount to member"},
  {dt:"21 Sep, 09:44", ref:"CSH-2026-00848", caller:"M. Priyantha Fernando", officer:"R. Perera", purpose:"Discharge notification", outcome:"Discharge captured, routed to coordinator"},
  {dt:"21 Sep, 08:15", ref:"CSH-2026-00845", caller:"J. Dilrukshi Fernando", officer:"R. Perera", purpose:"Cashless intimation", outcome:"Waiting-period flag — approval request raised"},
  {dt:"20 Sep, 16:02", ref:"RMB-2026-01221", caller:"R. Chandima Perera", officer:"D. Perera", purpose:"Reimbursement intimation", outcome:"Registered — awaiting documents"},
  {dt:"20 Sep, 14:32", ref:"CSH-2026-00842", caller:"T. Nuwan Fernando", officer:"R. Perera", purpose:"Cashless intimation", outcome:"Registered — coordinator assigned"},
];

let claimSeq = 852;
let reimSeq = 1222;

/* ============================ HELPERS ============================ */

function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function $all(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }
function esc(s){ return (s===undefined||s===null) ? "" : String(s); }

function nowStr(){
  const d = new Date();
  const opts = {day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit"};
  return d.toLocaleString("en-GB", opts).replace(",", " ·");
}

function toast(title, body, kind){
  const wrap = $("#toast-wrap");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>
    <div><div class="tt">${esc(title)}</div><div>${esc(body)}</div></div>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transform="translateY(6px)"; el.style.transition="all .25s ease"; setTimeout(()=>el.remove(),260); }, 3600);
}

function findPolicy(type, value){
  value = (value||"").trim().toLowerCase();
  if(!value) return null;
  for(const p of policies){
    if(type==="Policy Number" && p.policyNo.toLowerCase().includes(value)) return {policy:p, member:p.members[0]};
    for(const m of p.members){
      if(type==="Member Number" && m.no.toLowerCase().includes(value)) return {policy:p, member:m};
      if(type==="NIC / Identification Number" && m.nic.toLowerCase().includes(value)) return {policy:p, member:m};
      if(type==="Contact Number") { /* fallback below */ }
      if((type==="Policy Number"||type==="Member Number"||type==="NIC / Identification Number") && m.name.toLowerCase().includes(value)) return {policy:p, member:m};
    }
  }
  // loose name / contact fallback across all fields
  for(const p of policies){
    for(const m of p.members){
      if(m.name.toLowerCase().includes(value) || p.policyNo.toLowerCase().includes(value)) return {policy:p, member:m};
    }
  }
  return null;
}

function pillForStatus(status){
  const map = {
    "Active":"green", "Inactive/Expired":"grey", "Settled":"green", "Declined":"coral", "Pending":"amber",
    "Approved":"green", "Hospitalization":"teal", "Discharge Intimation":"amber", "Claim Processing":"navy",
    "Coordinator Assigned":"teal", "Cashless Approval Pending":"amber", "Documents pending":"amber", "Registered":"teal",
    "Under review":"amber",
  };
  return map[status] || "grey";
}

function pillHTML(status){
  const c = pillForStatus(status);
  return `<span class="pill pill-${c}"><span class="d"></span>${esc(status)}</span>`;
}

function checkIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>`;
}

function stepperHTML(stageIdx){
  return stages.map((s,i)=>{
    const cls = i < stageIdx ? "done" : (i===stageIdx ? "current" : "");
    return `<div class="step ${cls}"><div class="line"></div><div class="node">${checkIcon()}</div><div class="lbl">${s}</div></div>`;
  }).join("");
}

/* ============================ NAVIGATION ============================ */

const viewMeta = {
  "dashboard":{title:"Dashboard", sub:"Live overview of cashless & reimbursement activity"},
  "new-cashless":{title:"New Cashless Intimation", sub:"Register a hospitalization notification"},
  "reimbursement":{title:"Reimbursement Intimation", sub:"Register an indoor, OPD or other reimbursement claim"},
  "discharge":{title:"Discharge Update", sub:"Record discharge information against a cashless claim"},
  "approvals":{title:"Approval Requests", sub:"Special approvals for restricted cashless claims"},
  "claim-search":{title:"Policy & Claim Search", sub:"Coverage, benefits and full claim history"},
  "hospitals":{title:"Approved Hospitals", sub:"Cashless network directory"},
  "roster":{title:"Coordinator Roster", sub:"Availability by hospital and shift"},
  "call-log":{title:"Call Log", sub:"Recorded claim-related calls"},
};

function showView(name){
  $all(".view").forEach(v=>v.classList.remove("active"));
  const target = $("#view-"+name);
  if(target) target.classList.add("active");
  $all(".nav-item").forEach(n=> n.classList.toggle("active", n.dataset.view===name));
  const meta = viewMeta[name];
  if(meta){ $("#topbar-title").textContent = meta.title; $("#topbar-sub").textContent = meta.sub; }
  window.scrollTo(0,0);
  $("#main").scrollTop = 0;
}

$all(".nav-item").forEach(n=>{
  n.addEventListener("click", ()=> showView(n.dataset.view));
});
$all("[data-goto]").forEach(b=> b.addEventListener("click", ()=> showView(b.dataset.goto)));

/* ============================ RENDER: DASHBOARD ============================ */

function computeStats(){
  const newCashless = claims.filter(c=>c.type==="Cashless" && c.stageIdx<=2).length;
  const pendingApprovals = approvals.filter(a=>a.status==="Pending").length;
  const approvedToday = claims.filter(c=>c.stageIdx>=4).length;
  const awaitingDischarge = claims.filter(c=>c.status==="Hospitalization").length;
  const completed = claims.filter(c=>c.status==="Settled").length;
  return [
    {n:newCashless, l:"New cashless intimations", cls:"c-teal", view:"new-cashless"},
    {n:pendingApprovals, l:"Pending cashless approvals", cls:"c-amber", view:"approvals"},
    {n:awaitingDischarge, l:"Claims awaiting discharge info", cls:"c-coral", view:"discharge"},
    {n:claims.length, l:"Claims assigned to coordinators", cls:"c-navy", view:"roster"},
    {n:completed, l:"Completed cashless claims", cls:"c-green", view:"claim-search"},
  ];
}

function renderDashboard(){
  const stats = computeStats();
  $("#stat-grid").innerHTML = stats.map(s=>`
    <div class="stat-tile ${s.cls}" data-goto2="${s.view}">
      <div class="num">${s.n}</div>
      <div class="lbl">${s.l}</div>
    </div>`).join("");
  $all("[data-goto2]").forEach(el=> el.addEventListener("click", ()=> showView(el.dataset.goto2)));

  const recent = [...claims].sort((a,b)=> (b.updated>a.updated?1:-1)).slice(0,8);
  $("#dash-recent-body").innerHTML = recent.map(c=>`
    <tr class="clickable" data-openclaim="${c.ref}">
      <td class="mono">${c.ref}</td>
      <td><div class="tname">${c.member}</div><div class="tsub">${c.memberNo}</div></td>
      <td>${c.hospital}</td>
      <td>${pillHTML(c.status)}</td>
      <td class="tsub">${c.updated}</td>
    </tr>`).join("");
  $all("[data-openclaim]").forEach(tr=> tr.addEventListener("click", ()=> openClaimDrawer(tr.dataset.openclaim)));

  const pend = approvals.filter(a=>a.status==="Pending");
  $("#dash-approval-count").textContent = pend.length + " open";
  $("#dash-approval-list").innerHTML = pend.length ? pend.map(a=>`
    <div class="list-row">
      <div><div class="l-main">${a.ref}</div><div class="l-sub">${a.member} · ${a.hospital}</div></div>
      ${pillHTML(a.status)}
    </div>`).join("") : `<div class="empty-state" style="padding:20px 8px;"><div class="t">No open approval requests</div></div>`;

  $("#dash-roster-list").innerHTML = coordinators.map(c=>`
    <div class="list-row">
      <div><div class="l-main">${c.name}</div><div class="l-sub">${c.hospitals.join(", ")}</div></div>
      <div class="roster-avail ${c.status}"><span class="d"></span>${c.status==="on"?"Available":c.status==="off"?"Off shift":"On leave"}</div>
    </div>`).join("");

  $("#nav-count-approvals").textContent = pend.length;
}

/* ============================ CASHLESS INTIMATION ============================ */

$("#csh-lookup-btn").addEventListener("click", ()=>{
  const type = $("#csh-lookup-type").value;
  const val = $("#csh-lookup-value").value;
  const res = findPolicy(type, val);
  const box = $("#csh-lookup-result");
  if(!res){
    box.innerHTML = `<div class="lookup-banner empty">No matching policy or member found. Check the value and search type, or try a partial name/policy number.</div>`;
    $("#csh-form-card").style.display = "none";
    return;
  }
  const {policy,member} = res;
  box.innerHTML = `<div class="lookup-banner">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>
      <div class="lookup-grid">
        <div><div class="k">Policy number</div><div class="v">${policy.policyNo}</div></div>
        <div><div class="k">Company</div><div class="v">${policy.company}</div></div>
        <div><div class="k">Policy period</div><div class="v">${policy.start} → ${policy.periodEnd}</div></div>
        <div><div class="k">Status</div><div class="v">${pillHTML(policy.status)}</div></div>
        <div><div class="k">Member</div><div class="v">${member.name}</div></div>
        <div><div class="k">Member no.</div><div class="v">${member.no}</div></div>
        <div><div class="k">Relationship</div><div class="v">${member.rel}</div></div>
        <div><div class="k">DOB / Effective</div><div class="v">${member.dob} · ${member.effective}</div></div>
      </div>
    </div>
    <div class="kv-grid" style="margin-bottom:4px;">
      ${policy.benefits.map(b=>`<div><div class="k">${b.name}</div><div class="v">${b.limit} <span style="color:var(--ink-faint); font-weight:400;">· used ${b.used}</span></div></div>`).join("")}
    </div>`;
  $("#csh-form-card").style.display = "block";
  $("#csh-now").value = nowStr();
  $("#csh-hospital").innerHTML = `<option value="">Select from approved hospital list…</option>` +
    hospitals.filter(h=>h.cashless && h.status==="Active").map(h=>`<option>${h.name}</option>`).join("");
  window._cshContext = {policy, member};
});

$("#csh-submit").addEventListener("click", ()=>{
  const ctx = window._cshContext;
  if(!ctx){ toast("Lookup required","Validate a policy/member before registering the claim."); return; }
  let ok = true;
  const required = ["#csh-hospital","#csh-admdate","#csh-admtime","#csh-diagnosis","#csh-caller-name","#csh-caller-contact"];
  required.forEach(sel=>{
    const el = $(sel); const field = el.closest(".field");
    if(!el.value){ field.classList.add("error"); ok=false; } else field.classList.remove("error");
  });
  if(!$("#csh-confirm").checked){ toast("Confirmation required","Please confirm the details before submitting."); ok=false; }
  if(!ok) return;

  claimSeq++;
  const ref = "CSH-2026-"+String(claimSeq).padStart(5,"0");
  const assignedCoord = coordinators.find(c=>c.hospitals.includes($("#csh-hospital").value)) || coordinators[0];
  const newClaim = {
    ref, type:"Cashless", policyNo:ctx.policy.policyNo, member:ctx.member.name, memberNo:ctx.member.no,
    hospital:$("#csh-hospital").value, admDate:$("#csh-admdate").value, admTime:$("#csh-admtime").value,
    diagnosis:$("#csh-diagnosis").value, amount:"Rs. 150,000", coordinator:assignedCoord.name,
    stageIdx:2, status:"Coordinator Assigned", caller:`${$("#csh-caller-name").value} (${$("#csh-caller-rel").value})`,
    callerContact:$("#csh-caller-contact").value, updated:nowStr()
  };
  claims.unshift(newClaim);
  callLog.unshift({dt:nowStr(), ref, caller:$("#csh-caller-name").value, officer:"R. Perera", purpose:"Cashless intimation", outcome:"Registered — coordinator assigned"});
  resetForm("new-cashless");
  toast("Claim registered", `${ref} assigned to ${assignedCoord.name}`);
  showClaimRefModal(ref, assignedCoord.name, "cashless");
});

/* ============================ REIMBURSEMENT ============================ */

$("#rmb-lookup-btn").addEventListener("click", ()=>{
  const type = $("#rmb-lookup-type").value;
  const val = $("#rmb-lookup-value").value;
  const res = findPolicy(type, val);
  const box = $("#rmb-lookup-result");
  if(!res){
    box.innerHTML = `<div class="lookup-banner empty">No matching policy or member found.</div>`;
    $("#rmb-form-card").style.display = "none";
    return;
  }
  const {policy,member} = res;
  box.innerHTML = `<div class="lookup-banner">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>
      <div class="lookup-grid">
        <div><div class="k">Policy number</div><div class="v">${policy.policyNo}</div></div>
        <div><div class="k">Company</div><div class="v">${policy.company}</div></div>
        <div><div class="k">Status</div><div class="v">${pillHTML(policy.status)}</div></div>
        <div><div class="k">Member</div><div class="v">${member.name} (${member.no})</div></div>
      </div>
    </div>`;
  $("#rmb-form-card").style.display = "block";
  window._rmbContext = {policy, member};
});

$("#rmb-submit").addEventListener("click", ()=>{
  const ctx = window._rmbContext;
  if(!ctx){ toast("Lookup required","Validate a policy/member before registering the claim."); return; }
  let ok = true;
  ["#rmb-diagnosis","#rmb-caller-name","#rmb-caller-contact"].forEach(sel=>{
    const el = $(sel); const field = el.closest(".field");
    if(!el.value){ field.classList.add("error"); ok=false; } else field.classList.remove("error");
  });
  if(!ok) return;
  reimSeq++;
  const ref = "RMB-2026-"+String(reimSeq).padStart(5,"0");
  const newClaim = {
    ref, type:"Reimbursement", policyNo:ctx.policy.policyNo, member:ctx.member.name, memberNo:ctx.member.no,
    hospital:$("#rmb-hospital").value || "—", admDate:$("#rmb-date").value, diagnosis:$("#rmb-diagnosis").value,
    claimKind:$("#rmb-type").value, caller:`${$("#rmb-caller-name").value} (${$("#rmb-caller-rel").value})`,
    callerContact:$("#rmb-caller-contact").value, status:"Documents pending", updated:nowStr()
  };
  claims.unshift(newClaim);
  callLog.unshift({dt:nowStr(), ref, caller:$("#rmb-caller-name").value, officer:"R. Perera", purpose:"Reimbursement intimation", outcome:"Registered — awaiting documents"});
  resetForm("reimbursement");
  toast("Claim registered", `${ref} — reimbursement documents advised to caller`);
  showClaimRefModal(ref, null, "reimbursement");
});

/* ============================ DISCHARGE ============================ */

$("#dis-search-btn").addEventListener("click", ()=>{
  const val = $("#dis-search").value.trim().toLowerCase();
  const box = $("#dis-result");
  const claim = claims.find(c=> c.type==="Cashless" && (c.ref.toLowerCase()===val || c.ref.toLowerCase().includes(val) || c.member.toLowerCase().includes(val) || c.policyNo.toLowerCase().includes(val)));
  if(!claim){
    box.innerHTML = `<div class="lookup-banner empty">No matching cashless admission found. Confirm the claim reference number with the caller.</div>`;
    return;
  }
  if(claim.status==="Settled" || claim.discharge){
    box.innerHTML = `<div class="card"><div class="lookup-banner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>
      <div>Discharge already recorded for <strong>${claim.ref}</strong> on ${claim.discharge?claim.discharge.date:"file"}. <a href="#" data-openclaim="${claim.ref}" style="color:var(--teal); font-weight:600;">View claim →</a></div></div></div>`;
    $all("[data-openclaim]", box).forEach(a=> a.addEventListener("click",(e)=>{e.preventDefault(); openClaimDrawer(claim.ref);}));
    return;
  }
  box.innerHTML = `
    <div class="card">
      <div class="lookup-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>
        <div class="lookup-grid">
          <div><div class="k">Claim reference</div><div class="v">${claim.ref}</div></div>
          <div><div class="k">Member</div><div class="v">${claim.member}</div></div>
          <div><div class="k">Hospital</div><div class="v">${claim.hospital}</div></div>
          <div><div class="k">Admission date</div><div class="v">${claim.admDate}</div></div>
        </div>
      </div>
      <div class="section-title"><span class="n">✓</span> Discharge details</div>
      <div class="form-grid">
        <div class="field"><label>Discharge date <span class="req">Required</span></label><input type="date" id="dis-date"></div>
        <div class="field"><label>Discharge time <span class="req">Required</span></label><input type="time" id="dis-time"></div>
        <div class="field span-3"><label>Final diagnosis</label><input type="text" id="dis-diag" placeholder="Confirmed final diagnosis"></div>
        <div class="field"><label>Final hospitalization amount</label><input type="text" id="dis-final-amt" placeholder="Rs."></div>
        <div class="field"><label>Approved cashless amount <span class="req">Required</span></label><input type="text" id="dis-approved-amt" placeholder="Rs."></div>
        <div class="field"><label>Additional amount payable by customer</label><input type="text" id="dis-extra-amt" placeholder="Rs. 0"></div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" id="dis-submit-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg>
          Submit discharge &amp; route to coordinator
        </button>
      </div>
    </div>`;
  $("#dis-submit-btn").addEventListener("click", ()=>{
    const dd = $("#dis-date").value, dt = $("#dis-time").value, ap = $("#dis-approved-amt").value;
    if(!dd || !dt || !ap){ toast("Missing fields","Discharge date, time and approved amount are required."); return; }
    claim.discharge = {date:dd, time:dt, finalDiag:$("#dis-diag").value, finalAmount:$("#dis-final-amt").value||"—", approvedAmount:ap, extra:$("#dis-extra-amt").value||"Rs. 0"};
    claim.stageIdx = 6; claim.status = "Discharge Intimation"; claim.updated = nowStr();
    callLog.unshift({dt:nowStr(), ref:claim.ref, caller:claim.caller.split(" (")[0], officer:"R. Perera", purpose:"Discharge notification", outcome:"Discharge captured, routed to coordinator"});
    toast("Discharge recorded", `${claim.ref} routed to ${claim.coordinator}`);
    box.innerHTML = "";
    $("#dis-search").value = "";
  });
});

/* ============================ APPROVALS ============================ */

function renderApprovals(){
  $("#appr-body").innerHTML = approvals.map((a,idx)=>`
    <tr>
      <td class="mono">${a.ref}</td>
      <td><div class="tname">${a.member}</div><div class="tsub">${a.hospital}</div></td>
      <td style="max-width:220px; font-size:12px; color:var(--ink-soft);">${a.restriction}</td>
      <td>${a.requestedBy}</td>
      <td>${a.officer}</td>
      <td>${pillHTML(a.status)}</td>
      <td>${a.status==="Pending" ? `<button class="btn btn-sm" data-review="${idx}">Review</button>` : `<button class="btn btn-ghost btn-sm" data-review="${idx}">View</button>`}</td>
    </tr>`).join("");
  $all("[data-review]").forEach(b=> b.addEventListener("click", ()=> openApprovalModal(parseInt(b.dataset.review))));
}

function openApprovalModal(idx){
  const a = approvals[idx];
  const inner = $("#modal-inner");
  const pending = a.status==="Pending";
  inner.innerHTML = `
    <div class="modal-head">
      <div><div class="eyebrow" style="margin-bottom:2px;">Approval request · ${a.ref}</div><h3>${a.member}</h3></div>
      <button class="modal-x" id="modal-close">✕</button>
    </div>
    <div class="kv-grid" style="margin-bottom:14px;">
      <div><div class="k">Hospital</div><div class="v">${a.hospital}</div></div>
      <div><div class="k">Requested by</div><div class="v">${a.requestedBy}</div></div>
      <div><div class="k">Authorized officer</div><div class="v">${a.officer}</div></div>
      <div><div class="k">Status</div><div class="v">${pillHTML(a.status)}</div></div>
    </div>
    <div class="card" style="background:var(--amber-bg); border-color:var(--amber-line); margin-bottom:14px;">
      <strong style="font-size:12.3px;">Policy condition / restriction</strong>
      <p style="font-size:12.3px; margin-top:4px;">${a.restriction}</p>
    </div>
    <div class="field" style="margin-bottom:14px;"><label>Remarks</label><textarea id="modal-remark" ${!pending?"readonly":""}>${a.remark||""}</textarea></div>
    ${pending ? `
    <div class="form-grid cols-2" style="margin-bottom:6px;">
      <div class="field"><label>Approved amount (if applicable)</label><input type="text" id="modal-amount" placeholder="Rs."></div>
      <div class="field"><label>Decision</label>
        <select id="modal-decision"><option>Approved</option><option>Partially Approved</option><option>Declined</option></select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn" id="modal-cancel">Close</button>
      <button class="btn btn-primary" id="modal-decide">Record decision</button>
    </div>` : `<div class="form-actions"><button class="btn" id="modal-cancel">Close</button></div>`}
  `;
  openModal();
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-cancel").addEventListener("click", closeModal);
  if(pending){
    $("#modal-decide").addEventListener("click", ()=>{
      a.status = $("#modal-decision").value === "Declined" ? "Declined" : "Approved";
      a.remark = $("#modal-remark").value;
      a.decidedAmount = $("#modal-amount").value || undefined;
      toast("Decision recorded", `${a.ref} marked ${a.status}`);
      closeModal();
      renderApprovals();
      renderDashboard();
    });
  }
}

$("#appr-new-btn").addEventListener("click", ()=>{
  const inner = $("#modal-inner");
  inner.innerHTML = `
    <div class="modal-head"><h3>Raise approval request</h3><button class="modal-x" id="modal-close">✕</button></div>
    <div class="form-grid cols-2">
      <div class="field span-2"><label>Claim reference number</label><input type="text" id="new-appr-ref" placeholder="e.g. CSH-2026-00851"></div>
      <div class="field span-2"><label>Policy condition / restriction preventing acceptance</label><textarea id="new-appr-reason" placeholder="Describe the restriction"></textarea></div>
      <div class="field"><label>Authorized officer</label>
        <select id="new-appr-officer"><option>Senior Manager – SHE &amp; PA Claims</option><option>AGM – Non-Motor Claims</option><option>CO – GI</option></select>
      </div>
    </div>
    <div class="form-actions"><button class="btn" id="modal-cancel">Cancel</button><button class="btn btn-primary" id="new-appr-submit">Submit request</button></div>
  `;
  openModal();
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-cancel").addEventListener("click", closeModal);
  $("#new-appr-submit").addEventListener("click", ()=>{
    const ref = $("#new-appr-ref").value.trim() || "CSH-2026-PENDING";
    const claim = claims.find(c=>c.ref===ref);
    approvals.unshift({ref, member: claim?claim.member:"—", hospital: claim?claim.hospital:"—",
      restriction: $("#new-appr-reason").value || "Restriction not specified", requestedBy:"R. Perera",
      officer:$("#new-appr-officer").value, status:"Pending", remark:""});
    toast("Approval request sent", `Routed to ${$("#new-appr-officer").value}`);
    closeModal();
    renderApprovals();
    renderDashboard();
  });
});

/* ============================ POLICY / CLAIM SEARCH ============================ */

$("#pol-lookup-btn").addEventListener("click", ()=>{
  const type = $("#pol-lookup-type").value;
  const val = $("#pol-lookup-value").value;
  const res = findPolicy(type, val);
  const box = $("#pol-result");
  if(!res){
    box.innerHTML = `<div class="lookup-banner empty">No matching policy or member found.</div>`;
    return;
  }
  renderPolicyResult(res.policy, res.member);
});

function renderPolicyResult(policy, activeMember){
  const relatedClaims = claims.filter(c=>c.policyNo===policy.policyNo);
  const box = $("#pol-result");
  box.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h3>${policy.company}</h3>
        ${pillHTML(policy.status)}
      </div>
      <div class="kv-grid" style="margin-bottom:14px;">
        <div><div class="k">Policy number</div><div class="v">${policy.policyNo}</div></div>
        <div><div class="k">Policy start</div><div class="v">${policy.start}</div></div>
        <div><div class="k">Policy period</div><div class="v">${policy.start} → ${policy.periodEnd}</div></div>
        <div><div class="k">Sales party</div><div class="v">${policy.sales}</div></div>
        <div><div class="k">Company HR contact</div><div class="v">${policy.hr}</div></div>
        <div><div class="k">Cashless approval details</div><div class="v">Enabled · network of ${hospitals.filter(h=>h.cashless).length} hospitals</div></div>
      </div>
      <div class="divider"></div>
      <strong style="font-size:12.6px;">Covered members</strong>
      <div class="table-wrap" style="margin-top:8px;">
        <table><thead><tr><th>Name</th><th>Member no.</th><th>Relationship</th><th>DOB</th><th>Effective date</th></tr></thead>
        <tbody>${policy.members.map(m=>`<tr class="${m===activeMember?'':''}"><td class="tname">${m.name}</td><td class="mono">${m.no}</td><td>${m.rel}</td><td>${m.dob}</td><td>${m.effective}</td></tr>`).join("")}</tbody></table>
      </div>
      <div class="divider"></div>
      <strong style="font-size:12.6px;">Benefit utilization</strong>
      <div class="kv-grid" style="margin-top:8px;">
        ${policy.benefits.map(b=>`<div><div class="k">${b.name}</div><div class="v">${b.limit}</div><div class="tsub">Used: ${b.used}</div></div>`).join("")}
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Claim history</h3><span class="meta">${relatedClaims.length} claim(s)</span></div>
      ${relatedClaims.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Claim ref.</th><th>Type</th><th>Member</th><th>Hospital</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>${relatedClaims.map(c=>`<tr class="clickable" data-openclaim="${c.ref}">
          <td class="mono">${c.ref}</td><td>${c.type}</td><td>${c.member}</td><td>${c.hospital}</td>
          <td>${c.amount||"—"}</td><td>${pillHTML(c.status)}</td></tr>`).join("")}</tbody></table></div>`
        : `<div class="empty-state"><div class="t">No claims on file for this policy</div></div>`}
    </div>
  `;
  $all("[data-openclaim]", box).forEach(tr=> tr.addEventListener("click", ()=> openClaimDrawer(tr.dataset.openclaim)));
}

/* ============================ HOSPITALS ============================ */

function renderHospitals(filter){
  filter = (filter||"").toLowerCase();
  const rows = hospitals.filter(h=> !filter || h.name.toLowerCase().includes(filter) || h.district.toLowerCase().includes(filter) || h.code.toLowerCase().includes(filter));
  $("#hosp-body").innerHTML = rows.map(h=>`
    <tr>
      <td class="mono">${h.code}</td>
      <td class="tname">${h.name}</td>
      <td>${h.district}</td>
      <td>${h.tel}</td>
      <td>${h.cashless ? '<span class="pill pill-green"><span class="d"></span>Available</span>' : '<span class="pill pill-grey"><span class="d"></span>Not available</span>'}</td>
      <td>${pillHTML(h.status)}</td>
    </tr>`).join("") || `<tr><td colspan="6"><div class="empty-state">No hospitals match your search</div></td></tr>`;
}
$("#hosp-search").addEventListener("input", (e)=> renderHospitals(e.target.value));

/* ============================ ROSTER ============================ */

function renderRoster(){
  $("#roster-body").innerHTML = coordinators.map(c=>`
    <tr>
      <td class="tname">${c.name}</td>
      <td class="mono">${c.emp}</td>
      <td>${c.hospitals.join(", ")}</td>
      <td>${c.shift}</td>
      <td>${c.contact}</td>
      <td><div class="roster-avail ${c.status}"><span class="d"></span>${c.status==="on"?"Available":c.status==="off"?"Off shift":"On leave"}</div></td>
      <td>${c.backup}</td>
    </tr>`).join("");
}

/* ============================ CALL LOG ============================ */

function renderCallLog(){
  $("#calllog-body").innerHTML = callLog.map(c=>`
    <tr>
      <td class="tsub">${c.dt}</td>
      <td class="mono">${c.ref}</td>
      <td>${c.caller}</td>
      <td>${c.officer}</td>
      <td>${c.purpose}</td>
      <td style="color:var(--ink-soft);">${c.outcome}</td>
    </tr>`).join("");
}

/* ============================ CLAIM DRAWER ============================ */

function openClaimDrawer(ref){
  const c = claims.find(x=>x.ref===ref);
  if(!c) return;
  $("#drawer-ref").textContent = c.ref;
  $("#drawer-sub").textContent = `${c.type} claim · ${c.member} · ${c.hospital}`;
  let body = `<div class="kv-grid" style="margin-bottom:18px;">
      <div><div class="k">Policy number</div><div class="v">${c.policyNo}</div></div>
      <div><div class="k">Member no.</div><div class="v">${c.memberNo}</div></div>
      <div><div class="k">Admission date</div><div class="v">${c.admDate||"—"} ${c.admTime||""}</div></div>
      <div><div class="k">Diagnosis</div><div class="v">${c.diagnosis||"—"}</div></div>
      <div><div class="k">Caller</div><div class="v">${c.caller}</div></div>
      <div><div class="k">Caller contact</div><div class="v">${c.callerContact}</div></div>
    </div>`;

  if(c.type==="Cashless"){
    body += `<div class="section-title" style="border:none; margin-bottom:6px;">Claim status</div>
      <div class="stepper">${stepperHTML(c.stageIdx)}</div>
      <div class="kv-grid" style="margin:8px 0 18px;">
        <div><div class="k">Assigned coordinator</div><div class="v">${c.coordinator}</div></div>
        <div><div class="k">Approximate claim amount</div><div class="v">${c.amount}</div></div>
      </div>`;
    if(c.discharge){
      body += `<div class="section-title" style="border:none; margin-bottom:8px;">Discharge details</div>
        <div class="kv-grid" style="margin-bottom:18px;">
          <div><div class="k">Discharge date</div><div class="v">${c.discharge.date} ${c.discharge.time}</div></div>
          <div><div class="k">Final diagnosis</div><div class="v">${c.discharge.finalDiag}</div></div>
          <div><div class="k">Final hospitalization amount</div><div class="v">${c.discharge.finalAmount}</div></div>
          <div><div class="k">Approved cashless amount</div><div class="v">${c.discharge.approvedAmount}</div></div>
          <div><div class="k">Additional payable by customer</div><div class="v">${c.discharge.extra}</div></div>
        </div>`;
    }
  } else {
    body += `<div class="kv-grid" style="margin-bottom:18px;">
      <div><div class="k">Claim type</div><div class="v">${c.claimKind||"—"}</div></div>
      <div><div class="k">Status</div><div class="v">${pillHTML(c.status)}</div></div>
    </div>`;
  }

  const relatedCalls = callLog.filter(l=>l.ref===c.ref);
  body += `<div class="section-title" style="border:none; margin-bottom:8px;">Call history against this claim</div>`;
  body += relatedCalls.length ? relatedCalls.map(l=>`
    <div class="call-note"><div class="top"><span>${l.dt} · ${l.officer}</span><span>${l.purpose}</span></div>${l.outcome}</div>`).join("")
    : `<p style="font-size:12.3px; color:var(--ink-faint);">No recorded calls yet for this claim.</p>`;

  body += `<div class="form-actions" style="justify-content:flex-start;">
      <button class="btn btn-sm" id="drawer-amend">Request amendment</button>
      <button class="btn btn-sm btn-danger" id="drawer-cancel">Cancel claim reference</button>
    </div>`;

  $("#drawer-body").innerHTML = body;
  $("#drawer-amend")?.addEventListener("click", ()=> toast("Amendment requested","Routed to Supervisor for approval before Coordinator acceptance."));
  $("#drawer-cancel")?.addEventListener("click", ()=> openCancelModal(c));
  $("#drawer-overlay").classList.add("open");
  $("#drawer").classList.add("open");
}
$("#drawer-close").addEventListener("click", closeDrawer);
$("#drawer-overlay").addEventListener("click", closeDrawer);
function closeDrawer(){ $("#drawer-overlay").classList.remove("open"); $("#drawer").classList.remove("open"); }

function openCancelModal(c){
  const inner = $("#modal-inner");
  inner.innerHTML = `
    <div class="modal-head"><h3>Cancel ${c.ref}</h3><button class="modal-x" id="modal-close">✕</button></div>
    <p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:12px;">Cancellation requires a valid reason and is subject to authorized Supervisor approval before the claim reference is marked cancelled.</p>
    <div class="field"><label>Reason for cancellation <span class="req">Required</span></label><textarea id="cancel-reason" placeholder="e.g. Duplicate intimation, incorrect member selected…"></textarea></div>
    <div class="form-actions"><button class="btn" id="modal-cancel">Close</button><button class="btn btn-danger" id="cancel-submit">Submit for approval</button></div>
  `;
  openModal();
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-cancel").addEventListener("click", closeModal);
  $("#cancel-submit").addEventListener("click", ()=>{
    if(!$("#cancel-reason").value.trim()){ toast("Reason required","Please provide a reason for cancellation."); return; }
    toast("Cancellation submitted", `${c.ref} sent to Supervisor for approval`);
    closeModal();
    closeDrawer();
  });
}

/* ============================ MODAL HELPERS ============================ */

function openModal(){ $("#modal-overlay").classList.add("open"); }
function closeModal(){ $("#modal-overlay").classList.remove("open"); }
$("#modal-overlay").addEventListener("click", (e)=>{ if(e.target.id==="modal-overlay") closeModal(); });

function showClaimRefModal(ref, coordinator, kind){
  const inner = $("#modal-inner");
  inner.innerHTML = `
    <div style="text-align:center; padding:10px 4px 4px;">
      <div style="width:46px;height:46px;border-radius:50%;background:var(--green-bg); border:1px solid var(--green-line); display:flex; align-items:center; justify-content:center; margin:0 auto 14px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.6" width="22" height="22"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <div class="eyebrow" style="justify-content:center; display:flex;">Claim registered</div>
      <h3 style="font-size:22px; margin-bottom:6px;">${ref}</h3>
      <p style="font-size:12.6px; color:var(--ink-soft); max-width:36ch; margin:0 auto 16px;">
        ${kind==="cashless" ? `This reference has been assigned to <strong>${coordinator}</strong>. Notifications have been sent to the coordinator, customer, sales party and company HR.`
        : `Advise the caller to submit supporting documents referencing this claim number within the policy-defined window.`}
      </p>
      <button class="btn btn-primary" id="modal-close2" style="width:100%; justify-content:center;">Done</button>
    </div>`;
  openModal();
  $("#modal-close2").addEventListener("click", closeModal);
}

/* ============================ RESET / GLOBAL SEARCH ============================ */

function resetForm(view){
  if(view==="new-cashless"){
    $all("#view-new-cashless input, #view-new-cashless textarea").forEach(el=> el.type!=="checkbox" ? el.value="" : el.checked=false);
    $("#csh-form-card").style.display="none";
    $("#csh-lookup-result").innerHTML="";
    window._cshContext = null;
  }
  if(view==="reimbursement"){
    $all("#view-reimbursement input, #view-reimbursement textarea").forEach(el=> el.value="");
    $("#rmb-form-card").style.display="none";
    $("#rmb-lookup-result").innerHTML="";
    window._rmbContext = null;
  }
}
$all("[data-reset]").forEach(b=> b.addEventListener("click", ()=> resetForm(b.dataset.reset)));

$("#global-search").addEventListener("keydown", (e)=>{
  if(e.key==="Enter"){
    const val = e.target.value.trim();
    if(!val) return;
    showView("claim-search");
    $("#pol-lookup-type").value = "Policy Number";
    $("#pol-lookup-value").value = val;
    $("#pol-lookup-btn").click();
  }
});

/* ============================ INIT ============================ */

function renderAll(){
  renderDashboard();
  renderApprovals();
  renderHospitals("");
  renderRoster();
  renderCallLog();
}
renderAll();
showView("dashboard");
})();
