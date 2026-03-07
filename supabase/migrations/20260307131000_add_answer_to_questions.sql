-- add_answer_to_questions.sql

-- add an "answer" column to the questions table so we can store FAQ responses
alter table public.questions
  add column if not exists answer text not null default '';

-- provide answers for any existing seeded rows (matches component's static data)
update public.questions set answer = 'Бид 2016 оноос хойш технологийн цогц үйлчилгээг найдвартай, мэргэжлийн түвшинд хүргэж ирсэн туршлагатай. Б ангиллын тусгай зөвшөөрөлтэй, олон улсын стандартыг мөрддөг.'
  where question = 'SF TECHNOLOGY бусад компаниудаас юугаараа ялгаатай вэ?';
update public.questions set answer = 'Шилэн кабелийн дэд бүтэц, 24/7 мониторинг, мэргэжлийн инженерүүдийн тасралтгүй дэмжлэгээр найдвартай байдлыг хангадаг.'
  where question = 'Өндөр хурдны интернэт үйлчилгээний найдвартай байдлыг хэрхэн баталгаажуулдаг вэ?';
update public.questions set answer = 'Олон улсын ISO стандарт, Hikvision болон бусад тэргүүлэгч брэндүүдийн шаардлагыг бүрэн хангасан суурилуулалт хийдэг.'
  where question = 'Камер, дохиоллын системийг суурилуулахдаа ямар олон улсын стандартыг мөрддөг вэ?';
update public.questions set answer = 'Тийм, бидний бүх шийдлүүд нь масштабтай, өргөтгөх боломжтой архитектуртай. Байгууллагын хэрэгцээ шаардлагад нийцүүлэн уян хатан тохируулна.'
  where question = 'Хэрэв байгууллага өргөжин, хэрэглээ нэмэгдвэл танай шийдлүүд өргөтгөгдөх боломжтой юу?';
update public.questions set answer = 'Манай баг нь мэдээллийн технологи, сүлжээ, аюулгүй байдлын чиглэлээр олон жилийн туршлагатай мэргэжилтнүүдээс бүрддэг.'
  where question = 'Танай багийн туршлага, мэргэжлийн чадавхи ямар түвшинд байдаг вэ?';
