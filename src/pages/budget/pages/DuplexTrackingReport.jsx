import { useEffect } from "react";
import pdfMake from "@utils/pdfmake";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseDuplex } from "@hooks/UseDuplex";
import { UseDuplexUnityBudgetItem } from "@hooks/UseDuplexUnityBudgetItem";
import { Loading } from "@utils/Loading";

export const DuplexTrackingReport = () => {
  const { t } = useI18n();
  const { loading: loadingBudget, error: errorBudget, getByDuplexId } = UseDuplexUnityBudgetItem();
  const { loading: loadingDuplexById, error: errorDuplexById, getById } = UseDuplex();
  const { loading: loadingDuplexAll, error: errorDuplexAll, data: dataDuplexAll, getAll } = UseDuplex();
  const currentDate = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  useEffect(() => {
    getAll();
  }, []);

  const fetchData = async (dupĺexId) => {
    try {
      const [dataDuplex, dataBudget] = await Promise.all([getById(dupĺexId), getByDuplexId(dupĺexId)]);

      handleDownloadPDF(dataDuplex, dataBudget);
    } catch (error) {
      console.error("Error en una de las llamadas", error);
    }
  };

  const generate = async (e, duplexId) => {
    if (duplexId === "") return;

    e.preventDefault();

    await fetchData(duplexId);
  };

  const handleDownloadPDF = async (dataDuplex, dataBudget) => {
    if (!dataBudget || dataBudget.length === 0) return;

    let totalToDate = Number(dataDuplex.subTotalSpent) + Number(dataDuplex.contractorsFee);
    let totalDeposit = Number(dataDuplex.deposit1) + Number(dataDuplex.deposit2);

    const structuredData = [];
    const divisions = dataBudget.filter((item) => item.budgetItem.typeItem === "D").sort((a, b) => a.budgetItem.orderItem - b.budgetItem.orderItem);

    divisions.forEach((division) => {
      const sectionItems = dataBudget
        .filter((item) => item.budgetItem.parentId === division.budgetItem.id && item.budgetItem.typeItem === "I")
        .sort((a, b) => a.budgetItem.orderItem - b.budgetItem.orderItem);

      const items = sectionItems.map((i) => ({
        division: "",
        description: i.budgetItem.descriptionEn,
        unit: i.budgetItem.unit,
        amountBudgete: i.amountBudgete,
        amountSpent: i.amountSpent,
        amountReal: i.amountReal,
      }));

      structuredData.push({
        division: division.budgetItem.code,
        section: division.budgetItem.descriptionEn,
        items,
      });
    });

    const headerRow = [
      { text: t("duplex-tracking-form.table-column-payitem"), bold: true },
      { text: t("duplex-tracking-form.table-column-description"), bold: true },
      { text: t("duplex-tracking-form.table-column-unit"), bold: true },
      { text: t("duplex-tracking-form.table-column-budgete"), bold: true },
      { text: t("duplex-tracking-form.table-column-spent"), bold: true },
      { text: t("duplex-tracking-form.table-column-real"), bold: true },
    ];

    const tableBody = [headerRow];
    let totalBudgete = 0;
    let totalReal = 0;

    structuredData.forEach((section) => {
      tableBody.push([{ text: section.division, fillColor: "#d3d3d3", bold: true, noWrap: true }, { text: section.section, colSpan: 5, fillColor: "#d3d3d3", bold: true }, {}, {}, {}, {}]);

      section.items.forEach((item) => {
        totalBudgete += Number(item.amountBudgete) || 0;
        totalReal += Number(item.amountReal) || 0;

        tableBody.push([
          { text: "", noWrap: true },
          { text: item.description, fillColor: "#ffff00" },
          item.unit,
          { text: item.amountBudgete, alignment: "right", fillColor: "#92d050" },
          { text: item.amountSpent, alignment: "right", fillColor: "#ffff00" },
          { text: item.amountReal, alignment: "right", fillColor: "#92d050" },
        ]);
      });
    });

    const pushTotalRow = (label, value, color = null, foreColor = null) => {
      const row = [
        { text: label, bold: true, colSpan: 3, alignment: "right" },
        { text: "" },
        { text: "" },
        //{ text: "", border: [false, false, false, false] },
        { text: "" },
        { text: value.toFixed(2), bold: true, alignment: "right", ...(foreColor && { color: foreColor }) },
        { text: "" },
      ];

      if (color) {
        row.forEach((cell) => {
          if (typeof cell === "object") {
            cell.fillColor = color;
          }
        });
      }

      return row;
    };

    tableBody.push([{ text: "A", colSpan: 6, fillColor: "#bfbfbf", color: "#bfbfbf" }]);

    tableBody.push([
      { text: "SUBTOTAL", bold: true, colSpan: 3, alignment: "right", fillColor: "#ffff00" },
      { text: "", fillColor: "#ffff00" },
      { text: "", fillColor: "#ffff00" },
      { text: totalBudgete.toFixed(2), bold: true, alignment: "right", fillColor: "#ffff00" },
      { text: Number(dataDuplex.subTotalSpent).toFixed(2), bold: true, alignment: "right", fillColor: "#ffff00" },
      { text: totalReal.toFixed(2), bold: true, alignment: "right", fillColor: "#ffff00" },
    ]);
    tableBody.push(pushTotalRow("CONTRACTORS'S FEE", Number(dataDuplex.contractorsFee), "#00b0f0"));
    tableBody.push(pushTotalRow("TOTAL TO DATE", totalToDate, "#00b050"));
    tableBody.push(pushTotalRow("1st DEPOSIT", Number(dataDuplex.deposit1)));
    tableBody.push(pushTotalRow("2nd DEPOSIT", Number(dataDuplex.deposit2)));
    tableBody.push(pushTotalRow("TOTAL DEPOSIT", totalDeposit));
    tableBody.push(pushTotalRow("BALANCE TO OPERATE", totalToDate - totalDeposit, null, "#ff0000"));

    const docDefinition = {
      content: [
        {
          columns: [{ text: t("duplex-tracking-form.report-title"), style: "header", bold: true, fontSize: 12 }],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              width: 110,
              stack: [{ text: t("util.report-date-generation"), bold: true }, { text: currentDate }],
              alignment: "LEFT",
            },
            {
              width: 100,
              stack: [{ text: t("duplex-form.code"), bold: true }, { text: dataDuplex.code }],
              alignment: "LEFT",
            },
            {
              width: "*",
              stack: [{ text: t("duplex-form.description"), bold: true }, { text: dataDuplex.description }],
              alignment: "LEFT",
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto", "auto"],
            body: tableBody,
          },
        },
      ],
      defaultStyle: {
        fontSize: 9,
      },
    };

    pdfMake.createPdf(docDefinition).download("project-budget.pdf");
  };

  if (loadingBudget || loadingDuplexAll || loadingDuplexById) return <Loading />;
  if (errorBudget || errorDuplexById || errorDuplexAll) return <p>Error: {errorBudget}</p>;

  return (
    <>
      <Title title={t("duplex-tracking.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label>Dúplex</label>
                <select id="cboDuplex" className="form-control">
                  <option value=""></option>
                  {dataDuplexAll.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} - {item.description}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-fw mr-1 mb-2"
                onClick={(e) => {
                  const selectedId = document.getElementById("cboDuplex").value;
                  generate(e, selectedId);
                }}>
                {t("button.accept")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
