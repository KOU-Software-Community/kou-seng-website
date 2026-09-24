// Kullanıcının arama metnini, düz metin olarak aranan bir $regex kaynağına
// çevirir: string değilse (ör. ?search=a&search=b dizisi) yok sayılır, 100
// karakterle sınırlanır ve regex özel karakterleri kaçışlanır. Böylece "(" gibi
// bir arama 500 vermez, pahalı desenler de veritabanına ulaşmaz.
const toSearchPattern = (value) =>
    typeof value === 'string' ? value.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';

export default toSearchPattern;
