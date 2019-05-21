using System.Collections.Generic;

namespace pghworks.Models
{
    public class Shape
    {
        public List<Points> Points { get; set; }
        public string[] Breaks { get; set; }
        public string ShapeType { get; set; }
    }

    public class Points
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}