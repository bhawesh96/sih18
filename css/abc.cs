using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;


namespace testingDatabase
{
    public partial class Form1 : Form
    {
       MySqlDataAdapter ad , ad1 , srca , dsta;
        DataSet ds , ds1 , srcs , dsts;
        DataTable dt , dt1 , srct , dstt;
        DataRow dr , dr1 , srcr , dstr;

        String srclat, srclon, dstlat, dstlon;
        String pin1, pin2;
        MySqlCommand cm = new MySqlCommand("");

        private void destPincode_TextChanged(object sender, EventArgs e)
        {
            connect1();
            try
            {
                if (destPincode.Text.ToString().Length == 6)
                {
                    pin2 = destPincode.Text.ToString();
                    cm.Connection = connection;
                    cm.CommandText = "select cities,state from location where pincode = '" + destPincode.Text.ToString() + "'";
                    ds1 = new DataSet();
                    ad1 = new MySqlDataAdapter();
                    ad1.SelectCommand = cm;
                    ad1.Fill(ds1, "sql2");
                    dt1 = ds1.Tables["sql2"];
                    dr1 = dt1.Rows[0];
                    if (string.IsNullOrEmpty(dr1.ItemArray[0].ToString()))
                    {
                        MessageBox.Show(" Destination Pincode doesnt exist in our database !");
                    }
                    else
                    {
                        string city1 = dr1["cities"].ToString();
                        string state1 = dr1["state"].ToString();

                        destCity.Text = city1;
                        destState.Text = state1;

                    }
                    cm.ExecuteNonQuery();
                }
            }
            catch (Exception erw)
            {
                Console.WriteLine(erw.ToString());
                MessageBox.Show("Enter a valid Pincode");
            }
           
        }

        private void srcPincode_TextChanged(object sender, EventArgs e)
        {
            connect1();
            try
            {
                if (srcPincode.Text.ToString().Length == 6)
                {
                    pin1 = srcPincode.Text.ToString();
                    cm.Connection = connection;
                    cm.CommandText = "select cities,state from location where pincode = '" + srcPincode.Text.ToString() + "'";
                    ds = new DataSet();
                    ad = new MySqlDataAdapter();
                    ad.SelectCommand = cm;
                    ad.Fill(ds, "sql1");
                    dt = ds.Tables["sql1"];
                    dr = dt.Rows[0];
                    if (string.IsNullOrEmpty(dr.ItemArray[0].ToString()))
                    {
                        MessageBox.Show(" Source Pincode doesnt exist in our database !");
                    }
                    else
                    {
                        string city = dr["cities"].ToString();
                        string state = dr["state"].ToString();

                        srcCity.Text = city;
                        srcState.Text = state;

                    }
                    cm.ExecuteNonQuery();
                }
            }
            catch(Exception err)
            {
                Console.WriteLine(err.ToString());
                MessageBox.Show("Enter a valid Pincode");
            }
        }

        private double DegreeToRadian(double lon2)
        {
            return Math.PI * lon2 / 180.0;
        }
        // WebBrowser webBrowser1 = new WebBrowser();
        public Form1()
        {
            InitializeComponent();

        }
        double R = 6373.0;
        private MySqlConnection connection;

        private string server , port;
        private string database;
        private string uid;
        private string password;

        public object Request { get; private set; }

        // private object webBrowser1;

        public void connect1()
        {
            try
            {
                server = "139.59.46.30";
                port = "3306";
                database = "sih2018";
                uid = "root";
                password = "password";
                string connectionString;
                connectionString = "SERVER=" + server + ";PORT=" + port + ";" + "DATABASE=" +
                database + ";" + "UID=" + uid + ";" + "PASSWORD=" + password + ";";
                connection = new MySqlConnection(connectionString);
                connection.Open();
                Console.WriteLine("YAYY! Connected");
            }
            catch (Exception e)
            {
                Console.WriteLine("Error: " + e);
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
        }

        private void textBox3_TextChanged(object sender, EventArgs e)
        {

        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            String selected= comboBox1.Text.ToString();
            if (selected == "Parcel")
            {
                width.Visible = true;
                height.Visible = true;
                length.Visible = true;
                widtht.Visible = true;
                heightt.Visible = true;
                lengtht.Visible = true;
            }
            else
            {
                width.Visible = false;
                height.Visible = false;
                length.Visible = false;
                widtht.Visible = false;
                heightt.Visible = false;
                lengtht.Visible = false;

            }


        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                connect1();
                cm.Connection = connection;
                cm.CommandText = "select latitude,longitude from location where pincode = '400001'";
                MySqlDataAdapter sda = new MySqlDataAdapter();
                cm.CommandType = CommandType.Text;  
                sda.SelectCommand = cm;
                DataTable dts = new DataTable();
                sda.Fill(dts);
                BindingSource bs = new BindingSource();
                bs.DataSource = dts;
                dataGridView1.DataSource = bs;
                sda.Update(dts);
                Console.WriteLine("");

                MySqlCommand cm1 = new MySqlCommand("");
                cm.Connection = connection;
                cm.CommandText = "select latitude,longitude from location where pincode = '" + pin1 + "'";
                srcs = new DataSet();
                srca = new MySqlDataAdapter();
                srca.SelectCommand = cm;
                srca.Fill(srcs, "sql3");
                srct = srcs.Tables["sql3"];
                srcr = srct.Rows[0];
                if (string.IsNullOrEmpty(srcr.ItemArray[0].ToString()))
                 {
                    MessageBox.Show(" Destination Pincode doesnt exist in our database !");
                 }
                else
                 {
                    srclat = srcr["latitude"].ToString();
                    srclon = srcr["longitude"].ToString();
                 }
                 cm.ExecuteNonQuery();

                 cm1.Connection = connection;
                 cm1.CommandText = "select latitude,longitude from location where pincode = '" + pin2 + "'";

                 dsts = new DataSet();
                 dsta = new MySqlDataAdapter();
                 dsta.SelectCommand = cm1;
                 dsta.Fill(dsts, "sql4");
                 dstt = dsts.Tables["sql4"];
                 dstr = dstt.Rows[0];
                if (string.IsNullOrEmpty(dstr.ItemArray[0].ToString()))
                {
                    MessageBox.Show(" Destination Pincode doesnt exist in our database !");
                }
                else
                {
                    dstlat = dstr["latitude"].ToString();
                    dstlon = dstr["longitude"].ToString();
                }

                cm1.ExecuteNonQuery();

                double lat1 = Double.Parse(srclat);
                double lon1 = Double.Parse(srclon);
                double lat2 = Double.Parse(dstlat);
                double lon2 = Double.Parse(dstlon);

                double source_lat = DegreeToRadian(lat1);
                double source_lon = DegreeToRadian(lon1);
                double dest_lat = DegreeToRadian(lat2);
                double dest_lon = DegreeToRadian(lon2);

                double dlon = source_lon - dest_lon;
                double dlat = dest_lat - source_lat;

                double a = Math.Pow(Math.Sin(dlat / 2), 2) + Math.Cos(source_lat) * Math.Cos(dest_lat) * Math.Pow(Math.Sin(dlon / 2), 2);
                double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
                double ans = R * c;
                Console.WriteLine(ans);
                MessageBox.Show(ans.ToString());
                
                connection.Close();
            }
            catch (Exception ew)
            {
                Console.WriteLine("Error AAYA: " + ew);
                // Console.WriteLine(ew.StackTrace);
            }
        }

       
    }
}
